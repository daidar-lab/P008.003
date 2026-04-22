import { ArrowUpRight, TrendingDown, CalendarRange } from 'lucide-react'
import { useApi } from '../api.js'

const fmtInt = (n) => new Intl.NumberFormat('pt-BR').format(n)
const fmtMoney = (n) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL'
}).format(n)
const fmtPct = (n) => new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1, maximumFractionDigits: 2
}).format(n)

function fmtRangeLabel(range) {
  if (!range?.from || !range?.to) return null
  const br = (s) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
    return m ? `${m[3]}/${m[2]}/${m[1]}` : s
  }
  return `${br(range.from)} – ${br(range.to)}`
}

/**
 * Card que consome um endpoint de métrica "NF vs. Negociado":
 *   endpoint: '/entradas-fiscais/metrics/nf-menor-que-negociado' ou
 *             '/entradas-fiscais/metrics/nf-maior-que-negociado'
 * props extras: title, dotColor, range={from,to}
 */
export default function NfVariationCard({
  endpoint,
  title,
  dotColor = '#e5484d',
  range,
  valorizacaoLabel = 'Valorização'
}) {
  const validRange = range?.from && range?.to && range.from <= range.to
  const query = validRange ? `?from=${range.from}&to=${range.to}` : ''
  const { data: nf, loading } = useApi(`${endpoint}${query}`, {
    fallback: { count: 0, total: 0, percent: 0, valorizacao: 0, valorTotal: 0, percentValorizacao: 0 }
  })

  const valorizacao        = Number(nf?.valorizacao ?? 0)
  const valorTotal         = Number(nf?.valorTotal ?? 0)
  const percentValorizacao = Number(nf?.percentValorizacao ?? 0)
  const count              = Number(nf?.count ?? 0)
  const total              = Number(nf?.total ?? 0)
  const percentItens       = Number(nf?.percent ?? 0)
  const rangeLabel = fmtRangeLabel(range)

  return (
    <div className="card nf-card">
      <div className="card-head">
        <span className="card-title">
          <span className="dot" style={{ background: dotColor }} />
          {title}
        </span>
        <button className="card-arrow" aria-label="Open">
          <ArrowUpRight size={14} />
        </button>
      </div>

      {rangeLabel && (
        <div className="nf-period">
          <CalendarRange size={12} />
          <span>{rangeLabel}</span>
          {loading && <span className="nf-loading">carregando…</span>}
        </div>
      )}

      <div className="nf-primary">
        <span className="nf-sublabel">{valorizacaoLabel}</span>
        <div className="nf-value-xl" style={{ color: dotColor }}>{fmtMoney(valorizacao)}</div>
        <div className="stat-delta down">
          <TrendingDown size={13} />
          <span>{fmtPct(percentValorizacao)}% do valor total</span>
        </div>
      </div>

      <div className="nf-grid">
        <div className="nf-cell">
          <span className="nf-sublabel">Valor total</span>
          <div className="nf-value-md">{fmtMoney(valorTotal)}</div>
        </div>
        <div className="nf-cell">
          <span className="nf-sublabel">Itens</span>
          <div className="nf-value-sm">
            <strong>{fmtInt(count)}</strong>
            <span className="nf-muted"> de {fmtInt(total)} · {fmtPct(percentItens)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
