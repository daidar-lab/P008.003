# Vento® Dashboard

Visualização em React inspirada na referência do dashboard "Vento®" (Overview),
com **API Node/Express + PostgreSQL** fornecendo os dados.

## Stack

- **Frontend:** React 18 + Vite + Recharts + lucide-react
- **Backend:** Node.js + Express + `pg` (PostgreSQL)
- **DB:** PostgreSQL 14+

## Estrutura

```
/                     # frontend (Vite)
  src/
    App.jsx, main.jsx, styles.css, api.js
    components/       # Sidebar, TopBar, cards, charts, tabelas
  vite.config.js      # proxy /api -> http://localhost:3001
server/               # backend
  index.js            # Express app
  db.js               # pool de conexões pg
  routes/             # /stats, /total-balance, /performance,
                      # /spent-amount, /spending, /revenue
  sql/                # schema.sql + seed.sql
  scripts/            # init-db.js, seed-db.js
```

## Rodando em desenvolvimento

1. **PostgreSQL**

   Suba um Postgres local e crie o banco:
   ```bash
   createdb vento
   ```

2. **API**

   ```bash
   cd server
   cp .env.example .env      # ajuste DATABASE_URL/credenciais
   npm install
   npm run db:init           # aplica schema.sql + seed.sql
   npm run dev               # http://localhost:3001
   ```

3. **Frontend**

   ```bash
   npm install
   npm run dev               # http://localhost:5173
   ```

   O Vite faz proxy de `/api` para a API, então o frontend consome
   `/api/stats`, `/api/performance`, etc. sem configuração adicional.

## Endpoints

| Rota                 | Descrição                                   |
|----------------------|----------------------------------------------|
| `GET /api/health`    | ping + status do Postgres                   |
| `GET /api/stats`     | cards: Total views, Customers, Orders       |
| `GET /api/total-balance` | série horária do gráfico de barras      |
| `GET /api/performance`   | semanas W1..W5 para o gráfico de linhas |
| `GET /api/spent-amount`  | donut 72% (Marketing × Operations)      |
| `GET /api/spending`      | tabela de categorias                    |
| `GET /api/revenue`       | gauge Online/Retail/Wholesale + total   |

Mais detalhes em [`server/README.md`](server/README.md).
