import { useMemo, useState } from 'react'
import TopBar from '../components/TopBar.jsx'
import VentoAI from '../components/VentoAI.jsx'
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

export default function Overview2() {
  const [period, setPeriod] = useState('This month')
  const [customRange, setCustomRange] = useState(() => monthRange(0))

  const activeRange = useMemo(() => {
    if (period === 'This month') return monthRange(0)
    if (period === 'Last month') return monthRange(-1)
    return customRange
  }, [period, customRange])

  return (
    <>
      <TopBar
        period={period}
        onPeriodChange={setPeriod}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
      />

      <section className="grid row-1">
        <NfVariationCard
          endpoint="/entradas-fiscais/metrics/nf-menor-que-negociado"
          title="Itens NF < Negociado"
          dotColor="#19b26b"
          trend="up"
          range={activeRange}
        />
        <NfVariationCard
          endpoint="/entradas-fiscais/metrics/nf-maior-que-negociado"
          title="Itens NF > Negociado"
          dotColor="#e5484d"
          trend="down"
          range={activeRange}
        />
        <NfVariationCard
          endpoint="/entradas-fiscais/metrics/nf-maior-que-negociado"
          title="Itens NF > Negociado (até 2%)"
          dotColor="#f5c518"
          trend="down"
          range={activeRange}
          maxPercent={2}
        />
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
