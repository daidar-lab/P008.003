import { TrendingUp, ChevronRight } from 'lucide-react'

export default function PriorizacaoAuditoria({ onClick, onExplainClick }) {
  const itensRelevantes = 12
  const coberturaFinanceira = 81
  const topFornecedores = [
    { nome: 'Fornecedor Premium S.A.', quantidade: 127, valor: 1245000 },
    { nome: 'Suprimentos Brasil Ltda', quantidade: 89, valor: 856000 },
    { nome: 'Distribuição Logística Inc', quantidade: 76, valor: 698500 },
    { nome: 'Comércio e Negócios Ltda', quantidade: 54, valor: 512000 },
    { nome: 'Fornecimentos Especializados', quantidade: 42, valor: 387000 }
  ]

  const fmtMoney = (n) => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(n)

  return (
    <div className="card auditoria-card">
      <div className="card-head">
        <span className="card-title">
          <span className="dot" style={{ background: '#8b5cf6' }} />
          Priorização de Auditoria
        </span>
        <button
          className="card-arrow"
          aria-label="Abrir lista"
          onClick={onClick}
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="auditoria-metrics">
        <div className="metric-item">
          <span className="metric-label">Itens relevantes</span>
          <div className="metric-value" style={{ color: '#8b5cf6' }}>
            {itensRelevantes}%
          </div>
          <span className="metric-desc">dos itens analisados</span>
        </div>

        <div className="metric-item">
          <span className="metric-label">Cobertura financeira</span>
          <div className="metric-value" style={{ color: '#06b6d4' }}>
            {coberturaFinanceira}%
          </div>
          <span className="metric-desc">do valor total</span>
        </div>
      </div>

      <div className="auditoria-top-fornecedores">
        <span className="sublabel">Top 5 fornecedores</span>
        <div className="fornecedores-list">
          {topFornecedores.slice(0, 3).map((f, idx) => (
            <div key={idx} className="fornecedor-item">
              <div className="fornecedor-rank">#{idx + 1}</div>
              <div className="fornecedor-info">
                <div className="fornecedor-nome">{f.nome}</div>
                <div className="fornecedor-stats">
                  <span>{f.quantidade} itens</span>
                  <span className="fornecedor-valor">{fmtMoney(f.valor)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="auditoria-view-all"
          onClick={onClick}
        >
          Ver todos os fornecedores →
        </button>
      </div>

      <button
        type="button"
        className="nf-explain-card-btn"
        onClick={(e) => { e.stopPropagation(); if (typeof onExplainClick === 'function') onExplainClick() }}
        title="Explique essa tela"
      >
        Explique essa tela
      </button>
    </div>
  )
}
