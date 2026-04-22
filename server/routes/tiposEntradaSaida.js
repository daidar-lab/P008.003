import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

function validate(body, { partial = false } = {}) {
  const errors = {}
  const codigo = typeof body?.codigo === 'string' ? body.codigo.trim() : ''
  const descricao = typeof body?.descricao === 'string' ? body.descricao.trim() : ''

  if (!partial || 'codigo' in (body || {})) {
    if (!codigo) errors.codigo = 'Código é obrigatório'
    else if (codigo.length > 50) errors.codigo = 'Código deve ter até 50 caracteres'
  }
  if (!partial || 'descricao' in (body || {})) {
    if (!descricao) errors.descricao = 'Descrição é obrigatória'
    else if (descricao.length > 250) errors.descricao = 'Descrição deve ter até 250 caracteres'
  }

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
      `SELECT id, codigo, descricao, created_at, updated_at
       FROM tipos_entrada_saida
       ${where}
       ORDER BY id ASC`,
      params
    )
    res.json(rows.map(mapRow))
  } catch (err) { next(err) }
})

// GET ONE
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'invalid_id' })
    }
    const { rows } = await query(
      `SELECT id, codigo, descricao, created_at, updated_at
       FROM tipos_entrada_saida
       WHERE id = $1`,
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
      `INSERT INTO tipos_entrada_saida (codigo, descricao)
       VALUES ($1, $2)
       RETURNING id, codigo, descricao, created_at, updated_at`,
      [codigo, descricao]
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
    const { errors, codigo, descricao } = validate(req.body)
    if (Object.keys(errors).length) {
      return res.status(400).json({ error: 'validation_error', fields: errors })
    }
    const { rows } = await query(
      `UPDATE tipos_entrada_saida
       SET codigo = $1, descricao = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, codigo, descricao, created_at, updated_at`,
      [codigo, descricao, id]
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
