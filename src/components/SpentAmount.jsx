import { ArrowUpRight, TrendingDown } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useApi } from '../api.js'

const FALLBACK = {
  totalLabel: '$125K',
  shares: [
    { name: 'marketing', value: 72 },
    { name: 'operations', value: 28 }
  ]
}

export default function SpentAmount() {
  const { data } = useApi('/spent-amount', { fallback: FALLBACK })
  const shares = data?.shares ?? FALLBACK.shares
  const [primary, secondary] = shares
  const primaryPct = Number(primary?.value ?? 72)

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
                data={shares}
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
            pointerEvents: 'none'
          }}>
            <span style={{
              background: '#2f6bff', color: 'white',
              padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700
            }}>{primaryPct}%</span>
          </div>
        </div>

        <div className="spent-meta">
          <div className="spent-amt">{data?.totalLabel ?? FALLBACK.totalLabel}</div>
          <div className="spent-delta">
            <TrendingDown size={12} color="#e5484d" />
            <span>Since last month</span>
          </div>
          <div className="spent-legend">
            <span className="legend-item">
              <span className="dot" style={{ background: '#bfd2ff' }} />
              {secondary?.name ? cap(secondary.name) : 'Marketing'}
            </span>
            <span className="legend-item">
              <span className="dot" style={{ background: '#2f6bff' }} />
              {primary?.name ? cap(primary.name) : 'Operations'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1) }
