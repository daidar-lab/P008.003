import { ArrowUpRight, TrendingDown } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Marketing', value: 72 },
  { name: 'Operations', value: 28 }
]

export default function SpentAmount() {
  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">Spent Amount</span>
        <button className="card-arrow" aria-label="Open">
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="spent-wrap">
        <div style={{ position: 'relative', height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={42}
                outerRadius={64}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="#2f6bff" />
                <Cell fill="#bfd2ff" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 16, color: 'white',
            pointerEvents: 'none'
          }}>
            <span style={{
              background: '#2f6bff', color: 'white',
              padding: '4px 8px', borderRadius: 6, fontSize: 12
            }}>72%</span>
          </div>
        </div>

        <div className="spent-meta">
          <div className="spent-amt">$125K</div>
          <div className="spent-delta">
            <TrendingDown size={12} color="#e5484d" />
            <span>Since last month</span>
          </div>
          <div className="spent-legend">
            <span className="legend-item"><span className="dot" style={{ background: '#bfd2ff' }} />Marketing</span>
            <span className="legend-item"><span className="dot" style={{ background: '#2f6bff' }} />Operations</span>
          </div>
        </div>
      </div>
    </div>
  )
}
