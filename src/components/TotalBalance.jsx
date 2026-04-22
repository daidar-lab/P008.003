import { useEffect, useState } from 'react'
import { ArrowUpRight, Maximize2, X as XIcon } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
  ResponsiveContainer, Tooltip
} from 'recharts'
import { useApi } from '../api.js'

const GREEN = '#19b26b'
const RED   = '#e5484d'

const fmtBRL = (n) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL'
}).format(n)

const fmtBRLCompact = (n) => {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `R$ ${(n / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}M`
  if (abs >= 1_000)     return `R$ ${(n / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k`
  return fmtBRL(n)
}

const fmtDayShort = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '')
  return m ? `${m[3]}/${m[2]}` : iso
}
const fmtDayLong = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '')
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso
}

function VarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const byKey = Object.fromEntries(payload.map((p) => [p.dataKey, p.value]))
  const savings = Number(byKey.savings || 0)
  const overspend = Number(byKey.overspend || 0)
  const net = savings - overspend
  return (
    <div className="perf-tooltip" style={{ minWidth: 180 }}>
      <div className="sub">{fmtDayLong(label)}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <span>NF &lt; Neg</span><span style={{ color: GREEN }}>{fmtBRL(savings)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <span>NF &gt; Neg</span><span style={{ color: RED }}>{fmtBRL(overspend)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10,
                    marginTop: 4, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <span>Líquido</span><strong>{fmtBRL(net)}</strong>
      </div>
    </div>
  )
}

const labelFmt = (v) => (v && v > 0) ? fmtBRLCompact(v) : ''

function VariationChart({ series, showLabels = false, yAxisWidth = 60 }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={series}
        barCategoryGap={showLabels ? 12 : 4}
        margin={{ top: showLabels ? 24 : 10, right: 8, bottom: 0, left: -8 }}
      >
        <CartesianGrid stroke="#eef0f3" strokeDasharray="3 4" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={fmtDayShort}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: showLabels ? 12 : 10, fill: '#9aa1ac' }}
          interval="preserveStartEnd"
          minTickGap={showLabels ? 8 : 14}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: showLabels ? 12 : 10, fill: '#9aa1ac' }}
          tickFormatter={fmtBRLCompact}
          width={yAxisWidth}
        />
        <Tooltip content={<VarTooltip />} cursor={{ fill: 'rgba(47, 107, 255, 0.06)' }} />
        <Bar dataKey="savings" fill={GREEN} radius={[3, 3, 0, 0]}>
          {showLabels && (
            <LabelList
              dataKey="savings" position="top"
              formatter={labelFmt}
              style={{ fontSize: 11, fontWeight: 600, fill: '#137a42' }}
            />
          )}
        </Bar>
        <Bar dataKey="overspend" fill={RED} radius={[3, 3, 0, 0]}>
          {showLabels && (
            <LabelList
              dataKey="overspend" position="top"
              formatter={labelFmt}
              style={{ fontSize: 11, fontWeight: 600, fill: '#b6242a' }}
            />
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function TotalBalance({ range }) {
  const [expanded, setExpanded] = useState(false)

  const qs = range?.from && range?.to && range.from <= range.to
    ? `?from=${range.from}&to=${range.to}`
    : ''
  const { data } = useApi(`/entradas-fiscais/metrics/variacao-diaria${qs}`, {
    fallback: { series: [], totals: { savings: 0, overspend: 0, net: 0, days: 0 } }
  })

  const series = Array.isArray(data?.series) ? data.series : []
  const totals = data?.totals ?? { savings: 0, overspend: 0, net: 0, days: 0 }
  const netPositive = totals.net >= 0
  const rangeLabel = range?.from && range?.to
    ? `${fmtDayShort(range.from)} — ${fmtDayShort(range.to)}`
    : 'Todos os períodos'

  useEffect(() => {
    if (!expanded) return
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  return (
    <>
      <div className="card">
        <div className="card-head">
          <span className="card-title">Total Balance</span>
          <button
            className="card-arrow"
            aria-label="Expandir gráfico"
            title="Expandir gráfico"
            onClick={() => setExpanded(true)}
          >
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em',
            color: netPositive ? GREEN : RED
          }}>
            {fmtBRLCompact(totals.net)}
          </div>
          <span className="balance-sub">{rangeLabel}</span>
        </div>

        <div style={{ height: 180, marginTop: 10 }}>
          <VariationChart series={series} />
        </div>

        <div className="legend">
          <span className="legend-item"><span className="dot" style={{ background: GREEN }} />NF &lt; Negociado</span>
          <span className="legend-item"><span className="dot" style={{ background: RED }} />NF &gt; Negociado</span>
          <span className="legend-item" style={{ marginLeft: 'auto', color: 'var(--text-3)' }}>
            {totals.days} dia{totals.days === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {expanded && (
        <div
          className="modal-backdrop chart-modal"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setExpanded(false) }}
        >
          <div className="modal modal-chart" role="dialog" aria-modal="true">
            <div className="modal-head chart-modal-head">
              <div>
                <h2>Total Balance · Variação diária</h2>
                <p>
                  NF &lt; Negociado vs. NF &gt; Negociado · {rangeLabel} ·
                  {' '}{totals.days} dia{totals.days === 1 ? '' : 's'}
                </p>
              </div>
              <div className="chart-modal-actions">
                <div className="chart-modal-net">
                  <span>Líquido</span>
                  <strong style={{ color: netPositive ? GREEN : RED }}>
                    {fmtBRL(totals.net)}
                  </strong>
                </div>
                <button
                  className="card-arrow"
                  aria-label="Fechar"
                  title="Fechar (Esc)"
                  onClick={() => setExpanded(false)}
                >
                  <XIcon size={16} />
                </button>
              </div>
            </div>

            <div className="modal-body chart-modal-body">
              <VariationChart series={series} showLabels yAxisWidth={80} />
            </div>

            <div className="modal-foot chart-modal-foot">
              <div className="legend" style={{ margin: 0 }}>
                <span className="legend-item"><span className="dot" style={{ background: GREEN }} />NF &lt; Negociado</span>
                <span className="legend-item"><span className="dot" style={{ background: RED }} />NF &gt; Negociado</span>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setExpanded(false)}
              >
                <Maximize2 size={14} style={{ transform: 'rotate(180deg)' }} />
                <span>Reduzir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
