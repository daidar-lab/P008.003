import { DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from 'lucide-react'

export default function PortalDoCusto() {
  return (
    <div className="page portal-custo">
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-icon">
            <DollarSign size={24} />
          </div>
          <div>
            <h1>Portal do Custo</h1>
            <p>Visão completa dos custos e análise de eficiência</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <section className="grid row-metrics">
          <div className="card metric-card">
            <div className="card-head">
              <span className="card-title">
                <span className="dot" style={{ background: '#19b26b' }} />
                Custo Total Mensal
              </span>
            </div>
            <div className="metric-value-large">R$ 2.847.392</div>
            <div className="stat-delta up">
              <TrendingUp size={13} />
              <span>+8.2% vs mês anterior</span>
            </div>
          </div>

          <div className="card metric-card">
            <div className="card-head">
              <span className="card-title">
                <span className="dot" style={{ background: '#e5484d' }} />
                Economia Potencial
              </span>
            </div>
            <div className="metric-value-large">R$ 156.840</div>
            <div className="stat-delta down">
              <TrendingDown size={13} />
              <span>5.5% do custo total</span>
            </div>
          </div>

          <div className="card metric-card">
            <div className="card-head">
              <span className="card-title">
                <span className="dot" style={{ background: '#f5c518' }} />
                Eficiência de Compra
              </span>
            </div>
            <div className="metric-value-large">87.3%</div>
            <div className="stat-delta up">
              <TrendingUp size={13} />
              <span>+2.1% vs meta</span>
            </div>
          </div>

          <div className="card metric-card">
            <div className="card-head">
              <span className="card-title">
                <span className="dot" style={{ background: '#8b5cf6' }} />
                Fornecedores Ativos
              </span>
            </div>
            <div className="metric-value-large">1.247</div>
            <div className="stat-delta neutral">
              <Activity size={13} />
              <span>42 novos este mês</span>
            </div>
          </div>
        </section>

        <section className="grid row-charts">
          <div className="card chart-card">
            <div className="card-head">
              <span className="card-title">
                <BarChart3 size={16} />
                Distribuição de Custos por Categoria
              </span>
            </div>
            <div className="chart-placeholder">
              <PieChart size={48} />
              <p>Gráfico de distribuição de custos</p>
              <small>Em desenvolvimento</small>
            </div>
          </div>

          <div className="card chart-card">
            <div className="card-head">
              <span className="card-title">
                <TrendingUp size={16} />
                Tendência de Custos Mensal
              </span>
            </div>
            <div className="chart-placeholder">
              <BarChart3 size={48} />
              <p>Gráfico de tendência mensal</p>
              <small>Em desenvolvimento</small>
            </div>
          </div>
        </section>

        <section className="grid row-analysis">
          <div className="card analysis-card">
            <div className="card-head">
              <span className="card-title">
                <Activity size={16} />
                Análises de Eficiência
              </span>
            </div>
            <div className="analysis-content">
              <div className="analysis-item">
                <div className="analysis-icon">
                  <TrendingUp size={20} style={{ color: '#19b26b' }} />
                </div>
                <div className="analysis-text">
                  <h4>Produtos com Melhor Performance</h4>
                  <p>Identificamos 15 produtos com economia superior a 15% em relação ao mercado</p>
                </div>
              </div>

              <div className="analysis-item">
                <div className="analysis-icon">
                  <TrendingDown size={20} style={{ color: '#e5484d' }} />
                </div>
                <div className="analysis-text">
                  <h4>Oportunidades de Otimização</h4>
                  <p>23 fornecedores com margem de negociação acima da média do setor</p>
                </div>
              </div>

              <div className="analysis-item">
                <div className="analysis-icon">
                  <BarChart3 size={20} style={{ color: '#f5c518' }} />
                </div>
                <div className="analysis-text">
                  <h4>Análise de Sazonalidade</h4>
                  <p>Padrões identificados em 8 categorias com variação sazonal significativa</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}