import { ArrowUpRight } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, ReferenceLine, Tooltip
} from 'recharts'

const data = [
  { w: 'W1', arrivals: 110, best: 70,  slow: 90 },
  { w: 'W2', arrivals: 145, best: 95,  slow: 135 },
  { w: 'W3', arrivals: 185, best: 159, slow: 210 },
  { w: 'W4', arrivals: 138, best: 175, slow: 168 },
  { w: 'W5', arrivals: 102, best: 190, slow: 120 }
]

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const p = payload.find(p => p.dataKey === 'best')
  if (!p) return null
  return (
    <div className="perf-tooltip">
      <div className="sub">W3 · Bestsellers</div>
      <div>${p.value}K</div>
    </div>
  )
}

export default function Performance() {
  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">Performance</span>
        <button className="card-arrow" aria-label="Open">
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 10, bottom: 5, left: -10 }}>
            <CartesianGrid stroke="#eef0f3" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="w"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9aa1ac' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9aa1ac' }}
              ticks={[0, 50, 100, 150, 200, 250]}
              tickFormatter={(v) => `${v}k`}
              domain={[0, 250]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cfd3da', strokeDasharray: '3 3' }} />
            <ReferenceLine x="W3" stroke="#cfd3da" strokeDasharray="3 3" />

            <Line type="monotone" dataKey="slow" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="arrivals" stroke="#19b26b" strokeWidth={2.5} dot={false} />
            <Line
              type="monotone"
              dataKey="best"
              stroke="#2f6bff"
              strokeWidth={2.5}
              dot={(props) => {
                if (props.payload.w === 'W3') {
                  return (
                    <circle cx={props.cx} cy={props.cy} r={5}
                      fill="#fff" stroke="#2f6bff" strokeWidth={2.5} />
                  )
                }
                return null
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="legend">
        <span className="legend-item"><span className="dot" style={{ background: '#19b26b' }} />New arrivals</span>
        <span className="legend-item"><span className="dot" style={{ background: '#2f6bff' }} />Bestsellers</span>
        <span className="legend-item"><span className="dot" style={{ background: '#f59e0b' }} />Slow-movers</span>
      </div>
    </div>
  )
}
