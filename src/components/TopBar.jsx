import { Share2, Building2 } from 'lucide-react'
import { useState } from 'react'

export const PERIOD_THIS_MONTH = 'Este mês'
export const PERIOD_LAST_MONTH = 'Mês anterior'
export const PERIOD_CUSTOM     = 'Personalizado'

const TABS = [PERIOD_THIS_MONTH, PERIOD_LAST_MONTH, PERIOD_CUSTOM]

export default function TopBar({
  period,
  onPeriodChange,
  customRange,
  onCustomRangeChange,
  filiais,
  codigoFilial,
  onCodigoFilialChange
}) {
  const [internalActive, setInternalActive] = useState(PERIOD_THIS_MONTH)
  const controlled = typeof onPeriodChange === 'function'
  const active = controlled ? period : internalActive
  const setActive = controlled ? onPeriodChange : setInternalActive

  const showFilial = typeof onCodigoFilialChange === 'function' && Array.isArray(filiais)

  return (
    <div className="topbar">
      <h1 className="page-title">Dashboard</h1>

      {showFilial && (
        <label className="topbar-filial" title="Filtrar por filial">
          <Building2 size={14} />
          <span className="topbar-filial-label">Filial</span>
          <select
            value={codigoFilial || ''}
            onChange={(e) => onCodigoFilialChange(e.target.value)}
            className="topbar-filial-select"
          >
            <option value="">Todas</option>
            {filiais.map((f) => (
              <option key={f.id} value={f.codigo}>
                {f.codigo} — {f.abreviatura}
              </option>
            ))}
          </select>
        </label>
      )}

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
