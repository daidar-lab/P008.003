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
  codigo: ['codigo', 'código', 'code', 'cod', 'sku'],
  descricao: ['descricao', 'descrição', 'description', 'descr', 'nome', 'name']
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

function validate(body) {
  const errors = {}
  const codigo = typeof body?.codigo === 'string' ? body.codigo.trim() : ''
  const descricao = typeof body?.descricao === 'string' ? body.descricao.trim() : ''

  if (!codigo) errors.codigo = 'Código é obrigatório'
  else if (codigo.length > 50) errors.codigo = 'Código deve ter até 50 caracteres'

  if (!descricao) errors.descricao = 'Descrição é obrigatória'
  else if (descricao.length > 250) errors.descricao = 'Descrição deve ter até 250 caracteres'

  return { errors, codigo, descricao }
}

function mapRow(r) {
  return {
    id: r.id,
    codigo: r.codigo,
    descricao: r.descricao,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }
}

const COLS = 'id, codigo, descricao, created_at, updated_at'

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
       FROM produtos
       ${where}
       ORDER BY id ASC`,
      params
    )
    res.json(rows.map(mapRow))
  } catch (err) { next(err) }
})

// TEMPLATE
router.get('/template.xlsx', (_req, res, next) => {
  try {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([
      ['codigo', 'descricao'],
      ['PRD-001', 'Camiseta básica branca'],
      ['PRD-002', 'Calça jeans azul'],
      ['PRD-003', 'Tênis esportivo']
    ])
    ws['!cols'] = [{ wch: 14 }, { wch: 40 }]
    XLSX.utils.book_append_sheet(wb, ws, 'Produtos')
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    res.setHeader('Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition',
      'attachment; filename="produtos_modelo.xlsx"')
    res.send(buf)
  } catch (err) { next(err) }
})

// IMPORT
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
      } catch {
        return res.status(400).json({ error: 'invalid_file', message: 'Arquivo inválido ou corrompido' })
      }
      const sheetName = wb.SheetNames[0]
      if (!sheetName) {
        return res.status(400).json({ error: 'empty_file', message: 'Planilha sem abas' })
      }
      const raw = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: '', raw: false })

      if (raw.length > 5000) {
        return res.status(413).json({
          error: 'too_many_rows',
          message: `Limite de 5000 linhas (recebido ${raw.length})`
        })
      }

      const errors = []
      const seen = new Map()
      const valid = []

      raw.forEach((rowRaw, i) => {
        const rowNum = i + 2
        const row = normalizeRow(rowRaw)
        const codigo = String(row.codigo ?? '').trim()
        const descricao = String(row.descricao ?? '').trim()

        if (!codigo && !descricao) return

        const rowErrors = []
        if (!codigo) rowErrors.push('codigo vazio')
        else if (codigo.length > 50) rowErrors.push('codigo > 50 caracteres')
        if (!descricao) rowErrors.push('descricao vazia')
        else if (descricao.length > 250) rowErrors.push('descricao > 250 caracteres')

        if (codigo) {
          const prev = seen.get(codigo.toLowerCase())
          if (prev) rowErrors.push(`codigo duplicado na planilha (também na linha ${prev})`)
          else seen.set(codigo.toLowerCase(), rowNum)
        }

        if (rowErrors.length) {
          errors.push({ row: rowNum, codigo, messages: rowErrors })
          return
        }
        valid.push({ rowNum, codigo, descricao })
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
          if (mode === 'upsert') {
            const result = await client.query(
              `INSERT INTO produtos (codigo, descricao)
               VALUES ($1, $2)
               ON CONFLICT (codigo) DO UPDATE SET
                 descricao = EXCLUDED.descricao,
                 updated_at = NOW()
               RETURNING (xmax = 0) AS new_row`,
              [r.codigo, r.descricao]
            )
            if (result.rows[0].new_row) inserted++
            else updated++
          } else {
            const result = await client.query(
              `INSERT INTO produtos (codigo, descricao)
               VALUES ($1, $2)
               ON CONFLICT (codigo) DO NOTHING
               RETURNING id`,
              [r.codigo, r.descricao]
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

      res.json({ totalRows: raw.length, inserted, updated, skipped, errors })
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
      `SELECT ${COLS} FROM produtos WHERE id = $1`,
      [id]
    )
    if (!rows.length) return res.status(404).json({ error: 'not_found' })
    res.json(mapRow(rows[0]))
  } catch (err) { next(err) }
})

// CREATE
router.post('/', async (req, res, next) => {
  try {
    const { errors, codigo, descricao } = validate(req.body)
    if (Object.keys(errors).length) {
      return res.status(400).json({ error: 'validation_error', fields: errors })
    }
    const { rows } = await query(
      `INSERT INTO produtos (codigo, descricao)
       VALUES ($1, $2)
       RETURNING ${COLS}`,
      [codigo, descricao]
    )
    res.status(201).json(mapRow(rows[0]))
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'duplicate_codigo',
        message: 'Já existe um produto com esse código'
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
    const { errors, codigo, descricao } = validate(req.body)
    if (Object.keys(errors).length) {
      return res.status(400).json({ error: 'validation_error', fields: errors })
    }
    const { rows } = await query(
      `UPDATE produtos
       SET codigo = $1, descricao = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING ${COLS}`,
      [codigo, descricao, id]
    )
    if (!rows.length) return res.status(404).json({ error: 'not_found' })
    res.json(mapRow(rows[0]))
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'duplicate_codigo',
        message: 'Já existe um produto com esse código'
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
      `DELETE FROM produtos WHERE id = $1`,
      [id]
    )
    if (!rowCount) return res.status(404).json({ error: 'not_found' })
    res.status(204).end()
  } catch (err) { next(err) }
})

export default router
