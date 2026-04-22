import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT week, new_arrivals, bestsellers, slow_movers
      FROM performance_weeks
      ORDER BY week ASC
    `)
    res.json(rows.map(r => ({
      w: r.week,
      arrivals: Number(r.new_arrivals),
      best: Number(r.bestsellers),
      slow: Number(r.slow_movers)
    })))
  } catch (err) { next(err) }
})

export default router
