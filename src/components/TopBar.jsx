import { Share2, Plus } from 'lucide-react'
import { useState } from 'react'

const TABS = ['This month', 'Last month', 'Custom']

export default function TopBar({
  period,
  onPeriodChange,
  customRange,
  onCustomRangeChange
}) {
  const [internalActive, setInternalActive] = useState('This month')
  const controlled = typeof onPeriodChange === 'function'
  const active = controlled ? period : internalActive
  const setActive = controlled ? onPeriodChange : setInternalActive

  return (
    <div className="topbar">
      <h1 className="page-title">Overview</h1>
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            className={`tab ${active === t ? 'active' : ''}`}
            onClick={() => setActive(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {controlled && active === 'Custom' && onCustomRangeChange && (
        <div className="custom-range" role="group" aria-label="Intervalo personalizado">
          <input
            type="date"
            value={customRange?.from || ''}
            onChange={(e) => onCustomRangeChange({ ...customRange, from: e.target.value })}
            aria-label="De"
          />
          <span className="custom-range-sep">→</span>
          <input
            type="date"
            value={customRange?.to || ''}
            onChange={(e) => onCustomRangeChange({ ...customRange, to: e.target.value })}
            aria-label="Até"
          />
        </div>
      )}

      <div className="topbar-right">
        <button className="icon-btn" aria-label="Share">
          <Share2 size={16} />
        </button>
        <button className="btn">
          <Plus size={15} strokeWidth={2.2} />
          <span>New Report</span>
        </button>
        <button className="btn btn-primary">
          <span>Upgrade to Plus</span>
        </button>
      </div>
    </div>
  )
}
