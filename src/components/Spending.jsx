import { ArrowUpRight, Box, Megaphone, Wallet, Wrench, HardHat } from 'lucide-react'

const rows = [
  { icon: Box,       tint: '#fce7ec', color: '#e5484d', label: 'Inventory',   amount: '$170.34', status: 'Within Budget', ok: true },
  { icon: Megaphone, tint: '#e9f0ff', color: '#2f6bff', label: 'Marketing',   amount: '$52.33',  status: 'Over Budget',   ok: false },
  { icon: Wallet,    tint: '#f1ebff', color: '#7c5cff', label: 'Payroll',     amount: '$86.23',  status: 'Over Budget',   ok: false },
  { icon: HardHat,   tint: '#fef2e0', color: '#f5a524', label: 'Operations',  amount: '$24.64',  status: 'Within Budget', ok: true },
  { icon: Wrench,    tint: '#e7f7ee', color: '#19b26b', label: 'Maintenance', amount: '$19.67',  status: 'Within Budget', ok: true }
]

export default function Spending() {
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
          {rows.map((r) => (
            <tr key={r.label}>
              <td>
                <span className="cat-cell">
                  <span className="cat-icon" style={{ background: r.tint, color: r.color }}>
                    <r.icon size={14} />
                  </span>
                  {r.label}
                </span>
              </td>
              <td>{r.amount}</td>
              <td>
                <span className="status-pill">
                  <span className="dot" style={{ background: r.ok ? '#19b26b' : '#e5484d' }} />
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
