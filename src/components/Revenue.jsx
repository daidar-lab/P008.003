import { ArrowUpRight } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Online',  value: 45, color: '#2f6bff' },
  { name: 'Retail',  value: 30, color: '#19b26b' },
  { name: 'Wholesale', value: 25, color: '#f5c518' }
]

export default function Revenue() {
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
              data={data}
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
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="gauge-center">
          <div className="gauge-value">$483K</div>
          <div className="gauge-label">Total Revenue</div>
        </div>
      </div>

      <div className="revenue-legend">
        {data.map((d) => (
          <span key={d.name} className="legend-item">
            <span className="dot" style={{ background: d.color }} />
            <span>{d.name}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
