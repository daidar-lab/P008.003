import { useCallback, useEffect, useMemo, useState } from 'react'
import TopBar, {
  PERIOD_THIS_MONTH, PERIOD_LAST_MONTH
} from '../components/TopBar.jsx'
import TotalBalance from '../components/TotalBalance.jsx'
import Performance from '../components/Performance.jsx'
import SpentAmount from '../components/SpentAmount.jsx'
import VariacaoPorGrupo from '../components/VariacaoPorGrupo.jsx'
import Revenue from '../components/Revenue.jsx'
import NfVariationCard from '../components/NfVariationCard.jsx'
import DayDetailsModal from '../components/DayDetailsModal.jsx'
import { useApi } from '../api.js'

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

const EXPLANATION_DATA = {
  screen: {
    title: 'Explique esta tela',
    description: 'Este painel traz o conceito de auditoria de entradas fiscais com cards de itens abaixo, acima e próximos ao valor negociado. Os dados estão apresentados como protótipo visual e, por isso, o contexto informa que os valores podem ser ilustrativos ou zerados no mock.',
    status: 'Tela geral'
  },
  lt: {
    title: 'Itens NF < Negociado',
    description: 'Mostra itens cuja nota fiscal ficou abaixo do valor negociado. Como este é um protótipo sem backend real, os valores são mockados e servem apenas para demonstrar a interação de seleção e explicação contextual.',
    status: 'Mock local'
  },
  gt: {
    title: 'Itens NF > Negociado',
    description: 'Refere-se a itens cuja nota fiscal ficou acima do valor negociado. A explicação contextual destaca o significado do card e informa que os valores não vêm de um banco de dados real.',
    status: 'Mock local'
  },
  'gt-le2': {
    title: 'Itens NF > Negociado (até 2%)',
    description: 'Exibe itens com diferença de até 2% acima do negociado. Este card tem intenção de mostrar como o dashboard separaria faixas de exceção mesmo quando os dados são apenas simulados.',
    status: 'Mock local'
  },
  'gt-gt2': {
    title: 'Itens NF > Negociado (acima de 2%)',
    description: 'Mostra itens com diferença maior que 2% acima do negociado. O texto reforça que os valores estão zerados ou fictícios porque o backend não está conectado a um banco de dados real.',
    status: 'Mock local'
  }
}

export default function Overview2() {
  const [period, setPeriod] = useState(PERIOD_THIS_MONTH)
  const [customRange, setCustomRange] = useState(() => monthRange(0))
  const [selectedCard, setSelectedCard] = useState(null)
  const [codigoFilial, setCodigoFilial] = useState('')
  // Right-click em um card abre o modal de detalhes focado naquela categoria.
  const [detailsCtx, setDetailsCtx] = useState(null)
  const [explainOpen, setExplainOpen] = useState(false)
  const [explanation, setExplanation] = useState(null)
  const [explanationLoading, setExplanationLoading] = useState(false)

  const { data: filiais } = useApi('/filiais', { fallback: [] })
  const filiaisList = Array.isArray(filiais) ? filiais : []

  const activeRange = useMemo(() => {
    if (period === PERIOD_THIS_MONTH) return monthRange(0)
    if (period === PERIOD_LAST_MONTH) return monthRange(-1)
    return customRange
  }, [period, customRange])

  const selected = CARDS.find((c) => c.key === selectedCard) || null
  const totalBalanceFilter = selected
    ? { ...selected.filter, label: selected.title, color: selected.dotColor }
    : null

  const loadExplanation = useCallback(async (key) => {
    setExplanationLoading(true)
    const payload = await new Promise((resolve) => {
      window.setTimeout(() => resolve(EXPLANATION_DATA[key] ?? EXPLANATION_DATA.screen), 120)
    })
    setExplanation(payload)
    setExplanationLoading(false)
    return payload
  }, [])

  const handleExplainClick = async () => {
    setExplainOpen(true)
    await loadExplanation(selectedCard || 'screen')
  }

  useEffect(() => {
    if (!explainOpen) return
    loadExplanation(selectedCard || 'screen')
  }, [selectedCard, explainOpen, loadExplanation])

  const toggle = (key) => setSelectedCard((prev) => (prev === key ? null : key))

  const filialCodigo = codigoFilial || null

  return (
    <>
      <TopBar
        period={period}
        onPeriodChange={setPeriod}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        filiais={filiaisList}
        codigoFilial={codigoFilial}
        onCodigoFilialChange={setCodigoFilial}
      />

      <section className="grid row-nf nf-dashboard-wrap">
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
            codigoFilial={filialCodigo}
            selected={selectedCard === c.key}
            showExplainButton={selectedCard === c.key}
            onClick={() => toggle(c.key)}
            onExplainClick={handleExplainClick}
            onContextMenu={() => setDetailsCtx({
              range: activeRange,
              codigoFilial: filialCodigo,
              filter: { ...c.filter, label: c.title, color: c.dotColor }
            })}
          />
        ))}

        {!selectedCard && (
          <button
            type="button"
            className="explain-screen-btn"
            onClick={handleExplainClick}
          >
            Explique essa tela
          </button>
        )}
      </section>

      {explainOpen && (
        <section className="explain-panel">
          <div className="explain-panel-head">
            <h2>{explanationLoading ? 'Carregando explicação…' : explanation?.title || 'Explicação'}</h2>
            <span className="explain-panel-status">{explanationLoading ? 'Aguardando' : explanation?.status || 'Prototipo'}</span>
          </div>
          <p>
            {explanationLoading
              ? 'Buscando explicação do card selecionado…'
              : explanation?.description || 'Clique em um dos cards ou em Explique essa tela para ver o contexto.'}
          </p>
        </section>
      )}

      <section className="grid row-2">
        <TotalBalance
          range={activeRange}
          filter={totalBalanceFilter}
          codigoFilial={filialCodigo}
        />
        <Performance />
      </section>

      <section className="grid row-3">
        <SpentAmount />
        <Revenue />
      </section>

      <section className="grid row-grupos">
        <VariacaoPorGrupo range={activeRange} codigoFilial={filialCodigo} />
      </section>

      {detailsCtx && (
        <DayDetailsModal
          range={detailsCtx.range}
          codigoFilial={detailsCtx.codigoFilial}
          filter={detailsCtx.filter}
          onClose={() => setDetailsCtx(null)}
        />
      )}
    </>
  )
}
