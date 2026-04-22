import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT bucket, hour, channel, amount
      FROM balance_buckets
      ORDER BY bucket ASC
    `)

    const total = rows.reduce((s, r) => s + Number(r.amount), 0)

    res.json({
      totalLabel: '$125K',
      totalUsd: total,
      period: 'Last month',
      buckets: rows.map(r => ({
        bucket: r.bucket,
        hour: r.hour,
        channel: r.channel,
        amount: Number(r.amount)
      }))
    })
  } catch (err) { next(err) }
})

export default router
