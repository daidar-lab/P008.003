import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const channels = await query(`
      SELECT name, value, color FROM revenue_channels
      ORDER BY position ASC
    `)
    const total = await query(`SELECT total FROM revenue_totals WHERE id = 1`)
    res.json({
      total: Number(total.rows[0]?.total ?? 0),
      totalLabel: '$483K',
      channels: channels.rows.map(r => ({
        name: r.name,
        value: Number(r.value),
        color: r.color
      }))
    })
  } catch (err) { next(err) }
})

export default router
