import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'

export default function StatCard({ title, dotColor, value, delta, trend = 'down' }) {
  const TrendIcon = trend === 'down' ? TrendingDown : TrendingUp
  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">
          <span className="dot" style={{ background: dotColor }} />
          {title}
        </span>
        <button className="card-arrow" aria-label="Open">
          <ArrowUpRight size={14} />
        </button>
      </div>
      <div className="stat-value">{value}</div>
      <div className={`stat-delta ${trend}`}>
        <TrendIcon size={13} />
        <span>{delta}</span>
      </div>
    </div>
  )
}
