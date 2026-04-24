import { X, TrendingUp } from 'lucide-react'

export default function TopFornecedoresModal({ onClose }) {
  const fornecedores = [
    { nome: 'Fornecedor Premium S.A.', quantidade: 127, valor: 1245000, risco: 'Baixo' },
    { nome: 'Suprimentos Brasil Ltda', quantidade: 89, valor: 856000, risco: 'Médio' },
    { nome: 'Distribuição Logística Inc', quantidade: 76, valor: 698500, risco: 'Baixo' },
    { nome: 'Comércio e Negócios Ltda', quantidade: 54, valor: 512000, risco: 'Alto' },
    { nome: 'Fornecimentos Especializados', quantidade: 42, valor: 387000, risco: 'Médio' },
    { nome: 'Soluções Integradas Brasil', quantidade: 38, valor: 342000, risco: 'Baixo' },
    { nome: 'Distribuidor Nacional Ltda', quantidade: 31, valor: 289500, risco: 'Médio' },
    { nome: 'Produtos Especiais S.A.', quantidade: 27, valor: 245600, risco: 'Alto' },
  ]

  const fmtMoney = (n) => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(n)

  const getRiscoColor = (risco) => {
    switch (risco) {
      case 'Baixo':
        return '#19b26b'
      case 'Médio':
        return '#f5c518'
      case 'Alto':
        return '#e5484d'
      default:
        return '#666'
    }
  }

  return (
    <>
      <div className="explain-modal-overlay" onClick={onClose} />
      <div className="explain-modal modal-fornecedores">
        <div className="explain-modal-content">
          <div className="explain-modal-head">
            <h2>Top Fornecedores - Priorização de Auditoria</h2>
            <button
              type="button"
              className="explain-modal-close"
              onClick={onClose}
              aria-label="Fechar"
            >
              ×
            </button>
          </div>
          <div className="explain-modal-body">
            <table className="fornecedores-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Fornecedor</th>
                  <th style={{ textAlign: 'right' }}>Itens</th>
                  <th style={{ textAlign: 'right' }}>Valor Total</th>
                  <th style={{ textAlign: 'center' }}>Risco</th>
                </tr>
              </thead>
              <tbody>
                {fornecedores.map((f, idx) => (
                  <tr key={idx} className="fornecedor-row">
                    <td>
                      <div className="fornecedor-rank-grande">#{idx + 1}</div>
                      <div className="fornecedor-cell-text">
                        <div className="fornecedor-nome-grande">{f.nome}</div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <strong>{f.quantidade}</strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="valor-fornecedor">{fmtMoney(f.valor)}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className="risco-badge"
                        style={{ background: getRiscoColor(f.risco) + '20', color: getRiscoColor(f.risco) }}
                      >
                        {f.risco}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
