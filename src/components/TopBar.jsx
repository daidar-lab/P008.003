import { Share2 } from 'lucide-react'
import { useState } from 'react'

export const PERIOD_THIS_MONTH = 'Este mês'
export const PERIOD_LAST_MONTH = 'Mês anterior'
export const PERIOD_CUSTOM     = 'Personalizado'

const TABS = [PERIOD_THIS_MONTH, PERIOD_LAST_MONTH, PERIOD_CUSTOM]

export default function TopBar({
  period,
  onPeriodChange,
  customRange,
  onCustomRangeChange
}) {
  const [internalActive, setInternalActive] = useState(PERIOD_THIS_MONTH)
  const controlled = typeof onPeriodChange === 'function'
  const active = controlled ? period : internalActive
  const setActive = controlled ? onPeriodChange : setInternalActive

  return (
    <div className="topbar">
      <h1 className="page-title">Dashboard</h1>
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

      {controlled && active === PERIOD_CUSTOM && onCustomRangeChange && (
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
        <button className="icon-btn" aria-label="Compartilhar">
          <Share2 size={16} />
        </button>
      </div>
    </div>
  )
}
