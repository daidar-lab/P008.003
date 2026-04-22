import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const shares = await query(`
      SELECT category, percent FROM spent_shares
      ORDER BY percent DESC
    `)
    const total = await query(`
      SELECT SUM(amount) AS total FROM balance_buckets
    `)
    res.json({
      totalLabel: '$125K',
      totalUsd: Number(total.rows[0]?.total ?? 0),
      shares: shares.rows.map(r => ({
        name: r.category,
        value: Number(r.percent)
      }))
    })
  } catch (err) { next(err) }
})

export default router
