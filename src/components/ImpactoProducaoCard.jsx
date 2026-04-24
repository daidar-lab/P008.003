import { TrendingUp, TrendingDown, AlertTriangle, Package } from 'lucide-react'

export default function ImpactoProducaoCard({ onExplainClick, onPortalClick }) {
  // Dados mock de impacto na produção
  const impactos = [
    {
      produto: 'Cerveja Império Puro Malte',
      insumo: 'Malte',
      desvioPercentual: 3.2,
      impactoProducao: 12450,
      status: 'crítico',
      descricao: 'Desvio de 3.2% no malte aumenta custo unitário em R$ 0,08 por litro'
    },
    {
      produto: 'Refrigerante Guaraná',
      insumo: 'Açúcar',
      desvioPercentual: 1.8,
      impactoProducao: 8750,
      status: 'moderado',
      descricao: 'Aumento de 1.8% no açúcar impacta margem em 0,5%'
    },
    {
      produto: 'Suco de Laranja',
      insumo: 'Concentrado',
      desvioPercentual: 5.1,
      impactoProducao: 15200,
      status: 'crítico',
      descricao: 'Desvio crítico de 5.1% no concentrado reduz rentabilidade em 2.1%'
    }
  ]

  const totalImpacto = impactos.reduce((sum, item) => sum + item.impactoProducao, 0)
  const itensCriticos = impactos.filter(item => item.status === 'crítico').length

  const fmtMoney = (n) => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(n)

  const getStatusColor = (status) => {
    switch (status) {
      case 'crítico':
        return '#e5484d'
      case 'moderado':
        return '#f5c518'
      case 'baixo':
        return '#19b26b'
      default:
        return '#666'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'crítico':
        return <AlertTriangle size={14} />
      case 'moderado':
        return <TrendingUp size={14} />
      case 'baixo':
        return <TrendingDown size={14} />
      default:
        return <Package size={14} />
    }
  }

  return (
    <div className="card impacto-producao-card">
      <div className="card-head">
        <span className="card-title">
          <span className="dot" style={{ background: '#8b5cf6' }} />
          Impacto na Produção
        </span>
        <button
          className="card-arrow"
          aria-label="Expandir"
          onClick={() => {}}
        >
          <TrendingUp size={14} />
        </button>
      </div>

      <div className="impacto-summary">
        <div className="impacto-metric">
          <span className="metric-label">Impacto Total</span>
          <div className="metric-value" style={{ color: '#e5484d' }}>
            {fmtMoney(totalImpacto)}
          </div>
          <span className="metric-desc">nos custos de produção</span>
        </div>

        <div className="impacto-metric">
          <span className="metric-label">Itens Críticos</span>
          <div className="metric-value" style={{ color: '#f5c518' }}>
            {itensCriticos}
          </div>
          <span className="metric-desc">requerem atenção</span>
        </div>
      </div>

      <div className="impacto-list">
        <span className="sublabel">Principais impactos</span>
        <div className="impacto-items">
          {impactos.slice(0, 2).map((item, idx) => (
            <div key={idx} className="impacto-item">
              <div className="impacto-header">
                <div className="impacto-produto">{item.produto}</div>
                <div className="impacto-status" style={{ color: getStatusColor(item.status) }}>
                  {getStatusIcon(item.status)}
                  <span>{item.status}</span>
                </div>
              </div>
              <div className="impacto-details">
                <div className="impacto-insumo">
                  <Package size={12} />
                  <span>{item.insumo}: +{item.desvioPercentual}%</span>
                </div>
                <div className="impacto-valor">
                  {fmtMoney(item.impactoProducao)}
                </div>
              </div>
              <div className="impacto-descricao">
                {item.descricao}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="impacto-view-all"
          onClick={() => onPortalClick && onPortalClick()}
        >
          Ver todos os impactos →
        </button>
      </div>

      {typeof onExplainClick === 'function' && (
        <button
          type="button"
          className="nf-explain-card-btn"
          onClick={(e) => { e.stopPropagation(); onExplainClick() }}
          title="Explique essa tela"
        >
          Explique essa tela
        </button>
      )}
    </div>
  )
}