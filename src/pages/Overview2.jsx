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

const formatValue = (n) => new Intl.NumberFormat('pt-BR').format(n)

export default function Overview2() {
  const { data: stats } = useApi('/stats', { fallback: STAT_FALLBACK })
  const { data: nfMetric } = useApi('/entradas-fiscais/metrics/nf-menor-que-negociado', {
    fallback: { count: 0, total: 0, percent: 0, valorizacao: 0 }
  })

  // Usa os stats da API, mas ignora 'total_views' — o primeiro card passa a
  // mostrar a contagem de itens com valor NF < valor negociado de compras.
  const otherStats = (stats || []).filter((s) => s.key !== 'total_views').slice(0, 2)

  const nfPercent     = Number(nfMetric?.percent ?? 0)
  const nfTotal       = Number(nfMetric?.total ?? 0)
  const nfCount       = Number(nfMetric?.count ?? 0)
  const nfValorizacao = Number(nfMetric?.valorizacao ?? 0)
  const nfPercentLabel = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1, maximumFractionDigits: 1
  }).format(nfPercent)
  const nfValorizacaoLabel = new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(nfValorizacao)

  return (
    <>
      <TopBar />

      <section className="grid row-1">
        <StatCard
          title="Itens NF < Negociado"
          dotColor="#e5484d"
          value={formatValue(nfCount)}
          delta={`${nfPercentLabel}% de ${formatValue(nfTotal)} itens`}
          trend="down"
          extra={
            <>
              <span className="label">Valorização</span>
              {nfValorizacaoLabel}
            </>
          }
        />
        {otherStats.map((s) => (
          <StatCard
            key={s.key}
            title={s.title}
            dotColor={s.dotColor}
            value={formatValue(s.value)}
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
