import { useMemo, useState } from 'react'
import TopBar from '../components/TopBar.jsx'
import TotalBalance from '../components/TotalBalance.jsx'
import Performance from '../components/Performance.jsx'
import SpentAmount from '../components/SpentAmount.jsx'
import Spending from '../components/Spending.jsx'
import Revenue from '../components/Revenue.jsx'
import NfVariationCard from '../components/NfVariationCard.jsx'

function toISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function monthRange(offset = 0) {
  const now = new Date()
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const last  = new Date(first.getFullYear(), first.getMonth() + 1, 0)
  return { from: toISODate(first), to: toISODate(last) }
}

const CARDS = [
  {
    key: 'lt',
    title: 'Itens NF < Negociado',
    dotColor: '#19b26b',
    trend: 'up',
    endpoint: '/entradas-fiscais/metrics/nf-menor-que-negociado',
    filter: { op: 'lt' }
  },
  {
    key: 'gt',
    title: 'Itens NF > Negociado',
    dotColor: '#e5484d',
    trend: 'down',
    endpoint: '/entradas-fiscais/metrics/nf-maior-que-negociado',
    filter: { op: 'gt' }
  },
  {
    key: 'gt-le2',
    title: 'Itens NF > Negociado (até 2%)',
    dotColor: '#f5c518',
    trend: 'down',
    endpoint: '/entradas-fiscais/metrics/nf-maior-que-negociado',
    maxPercent: 2,
    filter: { op: 'gt', maxPercent: 2 }
  },
  {
    key: 'gt-gt2',
    title: 'Itens NF > Negociado (acima de 2%)',
    dotColor: '#c01d22',
    trend: 'down',
    endpoint: '/entradas-fiscais/metrics/nf-maior-que-negociado',
    minPercent: 2,
    filter: { op: 'gt', minPercent: 2 }
  }
]

export default function Overview2() {
  const [period, setPeriod] = useState('This month')
  const [customRange, setCustomRange] = useState(() => monthRange(0))
  const [selectedCard, setSelectedCard] = useState(null)

  const activeRange = useMemo(() => {
    if (period === 'This month') return monthRange(0)
    if (period === 'Last month') return monthRange(-1)
    return customRange
  }, [period, customRange])

  const selected = CARDS.find((c) => c.key === selectedCard) || null
  const totalBalanceFilter = selected
    ? { ...selected.filter, label: selected.title, color: selected.dotColor }
    : null

  const toggle = (key) => setSelectedCard((prev) => (prev === key ? null : key))

  return (
    <>
      <TopBar
        period={period}
        onPeriodChange={setPeriod}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
      />

      <section className="grid row-nf">
        {CARDS.map((c) => (
          <NfVariationCard
            key={c.key}
            endpoint={c.endpoint}
            title={c.title}
            dotColor={c.dotColor}
            trend={c.trend}
            range={activeRange}
            maxPercent={c.maxPercent}
            minPercent={c.minPercent}
            selected={selectedCard === c.key}
            onClick={() => toggle(c.key)}
          />
        ))}
      </section>

      <section className="grid row-2">
        <TotalBalance range={activeRange} filter={totalBalanceFilter} />
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
