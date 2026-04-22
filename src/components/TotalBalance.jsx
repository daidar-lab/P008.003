import { ArrowUpRight } from 'lucide-react'
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts'
import { useApi } from '../api.js'

const CHANNEL_COLORS = {
  bank_transfer: '#2f6bff',
  momo: '#f5c518',
  cash: '#19b26b'
}

const hours = [7, 8, 9, 10, 11, 12, 13]
const FALLBACK = {
  totalLabel: '$125K',
  period: 'Last month',
  buckets: Array.from({ length: 35 }, (_, i) => {
    const base = 30 + Math.sin(i / 3) * 18 + (i % 5) * 6
    const jitter = (i * 37) % 22
    const hour = hours[Math.floor(i / 5)]
    const channel = hour < 10 ? 'bank_transfer' : hour < 12 ? 'momo' : 'cash'
    return { bucket: i, hour, channel, amount: Math.max(12, Math.round(base + jitter)) }
  })
}

export default function TotalBalance() {
  const { data } = useApi('/total-balance', { fallback: FALLBACK })
  const buckets = data?.buckets ?? FALLBACK.buckets

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">Total Balance</span>
        <button className="card-arrow" aria-label="Open">
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
          {data?.totalLabel ?? FALLBACK.totalLabel}
        </div>
        <span className="balance-sub">{data?.period ?? FALLBACK.period}</span>
      </div>

      <div style={{ height: 150, marginTop: 10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={buckets} barCategoryGap={2} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
            <XAxis dataKey="bucket" hide />
            <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
              {buckets.map((d, i) => (
                <Cell key={i} fill={CHANNEL_COLORS[d.channel] || '#2f6bff'} opacity={0.9} />
              ))}
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
