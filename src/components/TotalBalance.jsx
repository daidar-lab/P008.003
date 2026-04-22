import { ArrowUpRight } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
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

export default function TotalBalance({ range }) {
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

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">Total Balance</span>
        <button className="card-arrow" aria-label="Open">
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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series} barCategoryGap={4} margin={{ top: 10, right: 4, bottom: 0, left: -8 }}>
            <CartesianGrid stroke="#eef0f3" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={fmtDayShort}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9aa1ac' }}
              interval="preserveStartEnd"
              minTickGap={14}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9aa1ac' }}
              tickFormatter={fmtBRLCompact}
              width={60}
            />
            <Tooltip content={<VarTooltip />} cursor={{ fill: 'rgba(47, 107, 255, 0.06)' }} />
            <Bar dataKey="savings"   fill={GREEN} radius={[3, 3, 0, 0]} />
            <Bar dataKey="overspend" fill={RED}   radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="legend">
        <span className="legend-item"><span className="dot" style={{ background: GREEN }} />NF &lt; Negociado</span>
        <span className="legend-item"><span className="dot" style={{ background: RED }} />NF &gt; Negociado</span>
        <span className="legend-item" style={{ marginLeft: 'auto', color: 'var(--text-3)' }}>
          {totals.days} dia{totals.days === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  )
}
