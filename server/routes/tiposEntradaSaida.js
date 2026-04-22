import { Router } from 'express'
import multer from 'multer'
import * as XLSX from 'xlsx'
import { query, pool } from '../db.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }
})

const HEADER_ALIASES = {
  codigo: ['codigo', 'código', 'code', 'cod'],
  descricao: ['descricao', 'descrição', 'description', 'descr'],
  consideraAnalise: [
    'consideraanalise', 'consideranaanalise', 'consideranalise',
    'consideranaanálise', 'consideranaanalisefinanceira',
    'analise', 'análise', 'consideraranalise', 'considerarnaanalise',
    'considerar', 'considera'
  ]
}

function normalizeKey(k) {
  return String(k ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

function matchAlias(normalized) {
  for (const [canonical, list] of Object.entries(HEADER_ALIASES)) {
    if (list.includes(normalized)) return canonical
  }
  return null
}

function normalizeRow(raw) {
  const out = {}
  for (const [k, v] of Object.entries(raw)) {
    const canonical = matchAlias(normalizeKey(k))
    if (canonical) out[canonical] = v
  }
  return out
}

function parseBool(v, fallback = true) {
  if (v === undefined || v === null) return fallback
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v !== 0
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase()
    if (['true', '1', 'sim', 'yes', 'on'].includes(s)) return true
    if (['false', '0', 'nao', 'não', 'no', 'off'].includes(s)) return false
  }
  return fallback
}

function validate(body) {
  const errors = {}
  const codigo = typeof body?.codigo === 'string' ? body.codigo.trim() : ''
  const descricao = typeof body?.descricao === 'string' ? body.descricao.trim() : ''
  const consideraAnalise = parseBool(body?.consideraAnalise, true)

  if (!codigo) errors.codigo = 'Código é obrigatório'
  else if (codigo.length > 50) errors.codigo = 'Código deve ter até 50 caracteres'

  if (!descricao) errors.descricao = 'Descrição é obrigatória'
  else if (descricao.length > 250) errors.descricao = 'Descrição deve ter até 250 caracteres'

  return { errors, codigo, descricao, consideraAnalise }
}

function mapRow(r) {
  return {
    id: r.id,
    codigo: r.codigo,
    descricao: r.descricao,
    consideraAnalise: r.considera_analise,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }
}

const COLS = 'id, codigo, descricao, considera_analise, created_at, updated_at'

// LIST
router.get('/', async (req, res, next) => {
  try {
    const q = (req.query.q || '').toString().trim()
    const params = []
    let where = ''
    if (q) {
      params.push(`%${q}%`)
      where = `WHERE codigo ILIKE $1 OR descricao ILIKE $1`
    }
    const { rows } = await query(
      `SELECT ${COLS}
       FROM tipos_entrada_saida
       ${where}
       ORDER BY id ASC`,
      params
    )
    res.json(rows.map(mapRow))
  } catch (err) { next(err) }
})

// GET TEMPLATE (download)
router.get('/template.xlsx', (_req, res, next) => {
  try {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([
      ['codigo', 'descricao', 'considera_analise'],
      ['ENT-001', 'Venda à vista', 'Sim'],
      ['SAI-001', 'Pagamento a fornecedor', 'Sim'],
      ['SAI-999', 'Ajuste contábil', 'Não']
    ])
    ws['!cols'] = [{ wch: 14 }, { wch: 40 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Tipos')
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    res.setHeader('Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition',
      'attachment; filename="tipos_entrada_saida_modelo.xlsx"')
    res.send(buf)
  } catch (err) { next(err) }
})

// IMPORT (multipart: field "file"; query: ?mode=insert|upsert, default insert)
router.post('/import', (req, res, next) => {
  upload.single('file')(req, res, async (uerr) => {
    if (uerr) {
      if (uerr.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'file_too_large', message: 'Arquivo excede 5MB' })
      }
      return res.status(400).json({ error: 'upload_error', message: uerr.message })
    }
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'no_file', message: 'Envie um arquivo .xlsx no campo "file"' })
      }

      const mode = (req.query.mode || 'insert').toString()
      if (!['insert', 'upsert'].includes(mode)) {
        return res.status(400).json({ error: 'invalid_mode' })
      }

      let wb
      try {
        wb = XLSX.read(req.file.buffer, { type: 'buffer' })
      } catch (e) {
        return res.status(400).json({ error: 'invalid_file', message: 'Arquivo inválido ou corrompido' })
      }
      const sheetName = wb.SheetNames[0]
      if (!sheetName) {
        return res.status(400).json({ error: 'empty_file', message: 'Planilha sem abas' })
      }
      const sheet = wb.Sheets[sheetName]
      const raw = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false })

      if (raw.length > 5000) {
        return res.status(413).json({
          error: 'too_many_rows',
          message: `Limite de 5000 linhas (recebido ${raw.length})`
        })
      }

      const errors = []
      const seenCodigos = new Map()    // codigo -> row# (para detectar duplicatas no próprio arquivo)
      const valid = []

      raw.forEach((rowRaw, i) => {
        const rowNum = i + 2              // 1-based + header
        const row = normalizeRow(rowRaw)
        const codigo = String(row.codigo ?? '').trim()
        const descricao = String(row.descricao ?? '').trim()

        if (!codigo && !descricao) return  // linha em branco, ignora silenciosamente

        const rowErrors = []
        if (!codigo) rowErrors.push('codigo vazio')
        else if (codigo.length > 50) rowErrors.push('codigo > 50 caracteres')
        if (!descricao) rowErrors.push('descricao vazia')
        else if (descricao.length > 250) rowErrors.push('descricao > 250 caracteres')

        if (codigo) {
          const prev = seenCodigos.get(codigo.toLowerCase())
          if (prev) rowErrors.push(`codigo duplicado na planilha (também na linha ${prev})`)
          else seenCodigos.set(codigo.toLowerCase(), rowNum)
        }

        if (rowErrors.length) {
          errors.push({ row: rowNum, codigo, messages: rowErrors })
          return
        }

        const consideraAnaliseRaw = row.consideraAnalise
        const considera = (() => {
          if (consideraAnaliseRaw === undefined || consideraAnaliseRaw === null || consideraAnaliseRaw === '') return true
          if (typeof consideraAnaliseRaw === 'boolean') return consideraAnaliseRaw
          const s = String(consideraAnaliseRaw).trim().toLowerCase()
          if (['true', '1', 'sim', 's', 'yes', 'y'].includes(s)) return true
          if (['false', '0', 'nao', 'não', 'n', 'no'].includes(s)) return false
          return true
        })()

        valid.push({ rowNum, codigo, descricao, consideraAnalise: considera })
      })

      if (errors.length && valid.length === 0) {
        return res.status(422).json({
          error: 'validation_error',
          totalRows: raw.length,
          inserted: 0, updated: 0, skipped: 0,
          errors
        })
      }

      const client = await pool.connect()
      let inserted = 0, updated = 0, skipped = 0
      try {
        await client.query('BEGIN')
        for (const r of valid) {
          let result
          if (mode === 'upsert') {
            result = await client.query(
              `INSERT INTO tipos_entrada_saida (codigo, descricao, considera_analise)
               VALUES ($1, $2, $3)
               ON CONFLICT (codigo) DO UPDATE SET
                 descricao = EXCLUDED.descricao,
                 considera_analise = EXCLUDED.considera_analise,
                 updated_at = NOW()
               RETURNING (xmax = 0) AS new_row`,
              [r.codigo, r.descricao, r.consideraAnalise]
            )
            if (result.rows[0].new_row) inserted++
            else updated++
          } else {
            result = await client.query(
              `INSERT INTO tipos_entrada_saida (codigo, descricao, considera_analise)
               VALUES ($1, $2, $3)
               ON CONFLICT (codigo) DO NOTHING
               RETURNING id`,
              [r.codigo, r.descricao, r.consideraAnalise]
            )
            if (result.rowCount === 1) inserted++
            else {
              skipped++
              errors.push({
                row: r.rowNum,
                codigo: r.codigo,
                messages: ['ignorado: código já cadastrado (use modo upsert para atualizar)']
              })
            }
          }
        }
        await client.query('COMMIT')
      } catch (e) {
        await client.query('ROLLBACK').catch(() => {})
        return next(e)
      } finally {
        client.release()
      }

      res.json({
        totalRows: raw.length,
        inserted, updated, skipped,
        errors
      })
    } catch (err) { next(err) }
  })
})

// GET ONE
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'invalid_id' })
    }
    const { rows } = await query(
      `SELECT ${COLS} FROM tipos_entrada_saida WHERE id = $1`,
      [id]
    )
    if (!rows.length) return res.status(404).json({ error: 'not_found' })
    res.json(mapRow(rows[0]))
  } catch (err) { next(err) }
})

// CREATE
router.post('/', async (req, res, next) => {
  try {
    const { errors, codigo, descricao, consideraAnalise } = validate(req.body)
    if (Object.keys(errors).length) {
      return res.status(400).json({ error: 'validation_error', fields: errors })
    }
    const { rows } = await query(
      `INSERT INTO tipos_entrada_saida (codigo, descricao, considera_analise)
       VALUES ($1, $2, $3)
       RETURNING ${COLS}`,
      [codigo, descricao, consideraAnalise]
    )
    res.status(201).json(mapRow(rows[0]))
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'duplicate_codigo',
        message: 'Já existe um tipo com esse código'
      })
    }
    next(err)
  }
})

// UPDATE
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'invalid_id' })
    }
    const { errors, codigo, descricao, consideraAnalise } = validate(req.body)
    if (Object.keys(errors).length) {
      return res.status(400).json({ error: 'validation_error', fields: errors })
    }
    const { rows } = await query(
      `UPDATE tipos_entrada_saida
       SET codigo = $1, descricao = $2, considera_analise = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING ${COLS}`,
      [codigo, descricao, consideraAnalise, id]
    )
    if (!rows.length) return res.status(404).json({ error: 'not_found' })
    res.json(mapRow(rows[0]))
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'duplicate_codigo',
        message: 'Já existe um tipo com esse código'
      })
    }
    next(err)
  }
})

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'invalid_id' })
    }
    const { rowCount } = await query(
      `DELETE FROM tipos_entrada_saida WHERE id = $1`,
      [id]
    )
    if (!rowCount) return res.status(404).json({ error: 'not_found' })
    res.status(204).end()
  } catch (err) { next(err) }
})

export default router
