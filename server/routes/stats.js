import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT metric_key, title, dot_color, value, delta_percent, trend, period
      FROM stats
      ORDER BY
        CASE metric_key
          WHEN 'total_views' THEN 1
          WHEN 'customers'   THEN 2
          WHEN 'orders'      THEN 3
          ELSE 99
        END
    `)
    res.json(rows.map(r => ({
      key: r.metric_key,
      title: r.title,
      dotColor: r.dot_color,
      value: Number(r.value),
      deltaPercent: Number(r.delta_percent),
      trend: r.trend,
      period: r.period
    })))
  } catch (err) { next(err) }
})

export default router
