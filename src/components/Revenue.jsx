import { ArrowUpRight } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useApi } from '../api.js'

const FALLBACK = {
  totalLabel: '$483K',
  channels: [
    { name: 'Online',    value: 45, color: '#2f6bff' },
    { name: 'Retail',    value: 30, color: '#19b26b' },
    { name: 'Wholesale', value: 25, color: '#f5c518' }
  ]
}

export default function Revenue() {
  const { data } = useApi('/revenue', { fallback: FALLBACK })
  const channels = data?.channels ?? FALLBACK.channels

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">Revenue</span>
        <button className="card-arrow" aria-label="Open">
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="gauge-wrap" style={{ height: 170 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={channels}
              cx="50%"
              cy="75%"
              startAngle={200}
              endAngle={-20}
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              cornerRadius={10}
              dataKey="value"
              stroke="none"
            >
              {channels.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="gauge-center">
          <div className="gauge-value">{data?.totalLabel ?? FALLBACK.totalLabel}</div>
          <div className="gauge-label">Total Revenue</div>
        </div>
      </div>

      <div className="revenue-legend">
        {channels.map((d) => (
          <span key={d.name} className="legend-item">
            <span className="dot" style={{ background: d.color }} />
            <span>{d.name}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
