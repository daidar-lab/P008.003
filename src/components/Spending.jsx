import { ArrowUpRight, Box, Megaphone, Wallet, Wrench, HardHat, Package } from 'lucide-react'
import { useApi } from '../api.js'

const ICONS = { box: Box, megaphone: Megaphone, wallet: Wallet, wrench: Wrench, hardhat: HardHat }

const FALLBACK = [
  { label: 'Inventory',   icon: 'box',       color: '#e5484d', tint: '#fce7ec', amount: 170.34, withinBudget: true },
  { label: 'Marketing',   icon: 'megaphone', color: '#2f6bff', tint: '#e9f0ff', amount: 52.33,  withinBudget: false },
  { label: 'Payroll',     icon: 'wallet',    color: '#7c5cff', tint: '#f1ebff', amount: 86.23,  withinBudget: false },
  { label: 'Operations',  icon: 'hardhat',   color: '#f5a524', tint: '#fef2e0', amount: 24.64,  withinBudget: true },
  { label: 'Maintenance', icon: 'wrench',    color: '#19b26b', tint: '#e7f7ee', amount: 19.67,  withinBudget: true }
]

const money = (n) => `$${Number(n).toFixed(2)}`

export default function Spending() {
  const { data } = useApi('/spending', { fallback: FALLBACK })
  const rows = Array.isArray(data) ? data : FALLBACK

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">Spending</span>
        <button className="card-arrow" aria-label="Open">
          <ArrowUpRight size={14} />
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount Spent</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const Icon = ICONS[r.icon] || Package
            return (
              <tr key={r.label}>
                <td>
                  <span className="cat-cell">
                    <span className="cat-icon" style={{ background: r.tint, color: r.color }}>
                      <Icon size={14} />
                    </span>
                    {r.label}
                  </span>
                </td>
                <td>{money(r.amount)}</td>
                <td>
                  <span className="status-pill">
                    <span className="dot" style={{ background: r.withinBudget ? '#19b26b' : '#e5484d' }} />
                    {r.withinBudget ? 'Within Budget' : 'Over Budget'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
