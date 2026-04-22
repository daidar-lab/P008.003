import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT position, label, icon, color, tint, amount, within_budget
      FROM spending_categories
      ORDER BY position ASC
    `)
    res.json(rows.map(r => ({
      label: r.label,
      icon: r.icon,
      color: r.color,
      tint: r.tint,
      amount: Number(r.amount),
      withinBudget: r.within_budget
    })))
  } catch (err) { next(err) }
})

export default router
