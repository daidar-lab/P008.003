import { ArrowUpRight, TrendingDown } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import StatCard from '../components/StatCard.jsx'
import VentoAI from '../components/VentoAI.jsx'
import TotalBalance from '../components/TotalBalance.jsx'
import Performance from '../components/Performance.jsx'
import SpentAmount from '../components/SpentAmount.jsx'
import Spending from '../components/Spending.jsx'
import Revenue from '../components/Revenue.jsx'
import { useApi } from '../api.js'

const STAT_FALLBACK = [
  { key: 'customers', title: 'Customers', dotColor: '#d946ef', value: 12375, deltaPercent: 7,  trend: 'down', period: 'since last month' },
  { key: 'orders',    title: 'Orders',    dotColor: '#19b26b', value: 23845, deltaPercent: 18, trend: 'down', period: 'since last month' }
]

const fmtInt = (n) => new Intl.NumberFormat('pt-BR').format(n)
const fmtMoney = (n) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL'
}).format(n)
const fmtPct = (n) => new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1, maximumFractionDigits: 2
}).format(n)

export default function Overview2() {
  const { data: stats } = useApi('/stats', { fallback: STAT_FALLBACK })
  const { data: nf } = useApi('/entradas-fiscais/metrics/nf-menor-que-negociado', {
    fallback: { count: 0, total: 0, percent: 0, valorizacao: 0, valorTotal: 0, percentValorizacao: 0 }
  })

  const otherStats = (stats || []).filter((s) => s.key !== 'total_views').slice(0, 2)

  const valorizacao        = Number(nf?.valorizacao ?? 0)
  const valorTotal         = Number(nf?.valorTotal ?? 0)
  const percentValorizacao = Number(nf?.percentValorizacao ?? 0)
  const count              = Number(nf?.count ?? 0)
  const total              = Number(nf?.total ?? 0)
  const percentItens       = Number(nf?.percent ?? 0)

  return (
    <>
      <TopBar />

      <section className="grid row-1">
        <div className="card nf-card">
          <div className="card-head">
            <span className="card-title">
              <span className="dot" style={{ background: '#e5484d' }} />
              Itens NF &lt; Negociado
            </span>
            <button className="card-arrow" aria-label="Open">
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="nf-primary">
            <span className="nf-sublabel">Valorização</span>
            <div className="nf-value-xl">{fmtMoney(valorizacao)}</div>
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

        {otherStats.map((s) => (
          <StatCard
            key={s.key}
            title={s.title}
            dotColor={s.dotColor}
            value={fmtInt(s.value)}
            delta={`${s.deltaPercent}% ${s.period}`}
            trend={s.trend}
          />
        ))}
        <VentoAI />
      </section>

      <section className="grid row-2">
        <TotalBalance />
        <Performance />
      </section>

      <section className="grid row-3">
        <SpentAmount />
        <Spending />
        <Revenue />
      </section>
    </>
  )
}
