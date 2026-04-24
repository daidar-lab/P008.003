import { ChevronRight, Zap } from 'lucide-react'

const fmtPct = (n) => new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1, maximumFractionDigits: 1
}).format(n)

const TOP_FORNECEDORES = [
  { rank: 1, nome: 'Fornecedor Alpha', relevancia: 94, cobertura: 28.5, itens: 847 },
  { rank: 2, nome: 'Fornecedor Beta', relevancia: 87, cobertura: 22.1, itens: 654 },
  { rank: 3, nome: 'Fornecedor Gamma', relevancia: 79, cobertura: 18.3, itens: 521 },
  { rank: 4, nome: 'Fornecedor Delta', relevancia: 72, cobertura: 12.1, itens: 389 },
  { rank: 5, nome: 'Fornecedor Epsilon', relevancia: 65, cobertura: 8.2, itens: 267 },
  { rank: 6, nome: 'Fornecedor Zeta', relevancia: 58, cobertura: 5.8, itens: 198 },
  { rank: 7, nome: 'Fornecedor Eta', relevancia: 51, cobertura: 3.2, itens: 124 },
  { rank: 8, nome: 'Fornecedor Theta', relevancia: 44, cobertura: 1.8, itens: 89 }
]

export default function AuditPrioritization({ onClick, onExplainClick, expanded = false }) {
  const relevanciaItens = 12
  const coberturaFinanceira = 81

  return (
    <>
      <div
        className={`card audit-prioritization-card ${expanded ? 'audit-card-expanded' : ''}`}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        }}
      >
        <div className="card-head">
          <span className="card-title">
            <Zap size={16} style={{ color: '#f5c518' }} />
            Priorização de Auditoria
          </span>
          <ChevronRight
            size={18}
            className={`audit-card-chevron ${expanded ? 'rotated' : ''}`}
            style={{ color: 'var(--text-3)' }}
          />
        </div>

        <div className="audit-metrics">
          <div className="audit-metric">
            <span className="audit-metric-label">Itens relevantes</span>
            <div className="audit-metric-value">{relevanciaItens}%</div>
          </div>
          <div className="audit-metric">
            <span className="audit-metric-label">Cobertura financeira</span>
            <div className="audit-metric-value" style={{ color: '#19b26b' }}>
              {coberturaFinanceira}%
            </div>
          </div>
        </div>

        {!expanded && (
          <div className="audit-preview">
            <span className="audit-preview-text">Top fornecedores</span>
            <span className="audit-expand-hint">Clique para expandir →</span>
          </div>
        )}

        <button
          type="button"
          className="nf-explain-card-btn"
          onClick={(e) => {
            e.stopPropagation()
            onExplainClick?.()
          }}
        >
          Explique essa tela
        </button>
      </div>

      {expanded && (
        <div className="audit-suppliers-panel">
          <div className="audit-suppliers-head">
            <h3>Top fornecedores por relevância</h3>
            <p className="audit-suppliers-subtitle">
              Ordenado por impacto na cobertura financeira
            </p>
          </div>

          <div className="audit-suppliers-list">
            <div className="audit-suppliers-header">
              <div className="col-rank">#</div>
              <div className="col-name">Fornecedor</div>
              <div className="col-metrics">
                <span>Relevância</span>
                <span>Cobertura</span>
                <span>Itens</span>
              </div>
            </div>

            {TOP_FORNECEDORES.map((f) => (
              <div key={f.rank} className="audit-supplier-row">
                <div className="col-rank">
                  <span className="rank-badge">{f.rank}</span>
                </div>
                <div className="col-name">
                  <span className="supplier-name">{f.nome}</span>
                </div>
                <div className="col-metrics">
                  <span className="metric-relevancia">
                    <div
                      className="metric-bar"
                      style={{
                        width: `${f.relevancia}%`,
                        background: 'linear-gradient(90deg, #f5c518, #e5484d)'
                      }}
                    />
                    <span className="metric-text">{fmtPct(f.relevancia)}</span>
                  </span>
                  <span className="metric-cobertura">
                    <div
                      className="metric-bar"
                      style={{
                        width: `${f.cobertura * 3.5}%`,
                        background: 'linear-gradient(90deg, #19b26b, #0d982a)'
                      }}
                    />
                    <span className="metric-text">{fmtPct(f.cobertura)}%</span>
                  </span>
                  <span className="metric-itens">
                    {new Intl.NumberFormat('pt-BR').format(f.itens)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
