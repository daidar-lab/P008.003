import { ArrowUpRight } from 'lucide-react'
import {
  BarChart, Bar, XAxis, ResponsiveContainer, Cell
} from 'recharts'

const hours = [7, 8, 9, 10, 11, 12, 13]
const data = Array.from({ length: 35 }, (_, i) => {
  const base = 30 + Math.sin(i / 3) * 18 + (i % 5) * 6
  const jitter = (i * 37) % 22
  return {
    name: `${hours[Math.floor(i / 5)]}:${(i % 5) * 12 || '00'}`,
    v: Math.max(12, Math.round(base + jitter))
  }
})

export default function TotalBalance() {
  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">Total Balance</span>
        <button className="card-arrow" aria-label="Open">
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>$125K</div>
        <span className="balance-sub">Last month</span>
      </div>

      <div style={{ height: 150, marginTop: 10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={2} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
            <XAxis dataKey="name" hide />
            <Bar dataKey="v" radius={[3, 3, 0, 0]}>
              {data.map((d, i) => {
                const hour = hours[Math.floor(i / 5)]
                let fill = '#2f6bff'
                if (hour >= 10 && hour < 12) fill = '#f5c518'
                else if (hour >= 12) fill = '#19b26b'
                return <Cell key={i} fill={fill} opacity={0.9} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="timebar" />
      <div className="timebar-labels">
        <span>7:00</span><span>9:00</span><span>11:00</span><span>13:00</span>
      </div>

      <div className="legend">
        <span className="legend-item"><span className="dot" style={{ background: '#2f6bff' }} />Bank Transfer</span>
        <span className="legend-item"><span className="dot" style={{ background: '#f5c518' }} />MoMo</span>
        <span className="legend-item"><span className="dot" style={{ background: '#19b26b' }} />Cash</span>
      </div>
    </div>
  )
}
