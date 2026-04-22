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
  { key: 'total_views', title: 'Total views', dotColor: '#e5484d', value: 253056, deltaPercent: 12, trend: 'down', period: 'since last month' },
  { key: 'customers',   title: 'Customers',   dotColor: '#d946ef', value: 12375,  deltaPercent: 7,  trend: 'down', period: 'since last month' },
  { key: 'orders',      title: 'Orders',      dotColor: '#19b26b', value: 23845,  deltaPercent: 18, trend: 'down', period: 'since last month' }
]

const formatValue = (n) => new Intl.NumberFormat('en-US').format(n)

export default function Overview2() {
  const { data: stats } = useApi('/stats', { fallback: STAT_FALLBACK })

  return (
    <>
      <TopBar />

      <section className="grid row-1">
        {stats.map((s) => (
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
