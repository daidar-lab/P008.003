# Vento® Dashboard

Visualização em React inspirada na referência do dashboard "Vento®" (Overview).

## Stack

- React 18 + Vite
- Recharts (gráficos)
- lucide-react (ícones)
- CSS puro (sem dependência de framework utilitário)

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
```

## Estrutura

```
src/
  App.jsx
  main.jsx
  styles.css
  components/
    Sidebar.jsx        # navegação lateral
    TopBar.jsx         # título, abas, ações
    StatCard.jsx       # Total views / Customers / Orders
    VentoAI.jsx        # painel "Ask me anything"
    TotalBalance.jsx   # gráfico de barras (receitas por hora)
    Performance.jsx    # gráfico de linhas (W1..W5)
    SpentAmount.jsx    # donut 72% (Marketing x Operations)
    Spending.jsx       # tabela de categorias
    Revenue.jsx        # gauge (Online / Retail / Wholesale)
```
