import { ArrowUpRight, Layers, TrendingUp, TrendingDown, Minus } from 'lucide-react'
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

const fmtInt = (n) => new Intl.NumberFormat('pt-BR').format(Number(n || 0))

export default function VariacaoPorGrupo({ range, codigoFilial }) {
  const parts = []
  if (range?.from && range?.to && range.from <= range.to) {
    parts.push(`from=${encodeURIComponent(range.from)}`)
    parts.push(`to=${encodeURIComponent(range.to)}`)
  }
  if (codigoFilial) parts.push(`codigoFilial=${encodeURIComponent(codigoFilial)}`)
  const qs = parts.length ? `?${parts.join('&')}` : ''

  const { data } = useApi(`/entradas-fiscais/metrics/variacao-por-grupo${qs}`, {
    fallback: { groups: [], totals: { count: 0, savings: 0, overspend: 0, net: 0 } }
  })

  const groups = Array.isArray(data?.groups) ? data.groups : []
  const totals = data?.totals ?? { count: 0, savings: 0, overspend: 0, net: 0 }

  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">
          <Layers size={13} />
          <span>Variação por Grupo</span>
        </span>
        <button className="card-arrow" aria-label="Open">
          <ArrowUpRight size={14} />
        </button>
      </div>

      <table className="table grupo-variacao-table">
        <thead>
          <tr>
            <th>Grupo</th>
            <th style={{ textAlign: 'right' }}>Itens</th>
            <th style={{ textAlign: 'right' }}>Saldo</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {groups.length === 0 && (
            <tr>
              <td colSpan={4}>
                <div className="empty-state" style={{ padding: 20 }}>
                  Nenhum grupo com variação nos filtros atuais.
                  <br />
                  <small>
                    Talvez seja necessário rodar <strong>Classificar grupos</strong>
                    em Entradas Fiscais.
                  </small>
                </div>
              </td>
            </tr>
          )}
          {groups.map((g) => {
            const positive = g.net >= 0
            const StatusIcon = g.net === 0 ? Minus : (positive ? TrendingUp : TrendingDown)
            const statusColor = g.net === 0 ? 'var(--text-3)' : (positive ? GREEN : RED)
            const statusLabel = g.net === 0 ? 'Sem divergência'
                               : positive    ? 'Economia'
                                             : 'Sobrepreço'
            return (
              <tr key={g.grupoId ?? 'null'}>
                <td>
                  <div className="grupo-cell">
                    <span className="grupo-pill" title={g.descricao || ''}>
                      <Layers size={10} />
                      {g.codigo || 'Sem grupo'}
                    </span>
                    <span className="grupo-desc" title={g.descricao || ''}>
                      {g.descricao || 'Não classificado'}
                    </span>
                  </div>
                </td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {fmtInt(g.count)}
                </td>
                <td style={{
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 700,
                  color: statusColor
                }}>
                  {g.net === 0 ? '—' : fmtBRLCompact(g.net)}
                </td>
                <td>
                  <span className="status-pill" style={{ color: statusColor }}>
                    <StatusIcon size={12} />
                    {statusLabel}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>

        {groups.length > 0 && (
          <tfoot>
            <tr>
              <td>
                <strong style={{ color: 'var(--text-2)' }}>Total</strong>
              </td>
              <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                {fmtInt(totals.count)}
              </td>
              <td style={{
                textAlign: 'right',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 700,
                color: totals.net >= 0 ? GREEN : RED
              }}>
                {fmtBRLCompact(totals.net)}
              </td>
              <td>
                <span className="status-pill" style={{ color: 'var(--text-3)' }}>
                  <small>
                    <span style={{ color: GREEN }}>▲ {fmtBRLCompact(totals.savings)}</span>
                    <span style={{ margin: '0 4px' }}>·</span>
                    <span style={{ color: RED }}>▼ {fmtBRLCompact(totals.overspend)}</span>
                  </small>
                </span>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
