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
  vite.config.js      # proxy /api -> http://localhost:3006
server/               # backend
  index.js            # Express app
  db.js               # pool de conexões pg
  routes/             # /stats, /total-balance, /performance,
                      # /spent-amount, /spending, /revenue
  sql/                # schema.sql + seed.sql
  scripts/            # init-db.js, seed-db.js
```

## Rodando em desenvolvimento

### Setup único (faça uma vez)

```bash
# Postgres rodando localmente — por padrão a aplicação se conecta à
# database "postgres" (que já existe em qualquer instalação).
# Ajustes de credenciais ficam em server/.env:
cp server/.env.example server/.env

# instala dependências (o postinstall instala também as do server/)
npm install
```

O servidor aplica o `sql/schema.sql` automaticamente no startup
(idempotente). Se quiser popular dados de exemplo:
`npm --prefix server run db:seed`.

### Rodando o app (um único comando)

```bash
npm run dev
```

Isso sobe **frontend + API juntos** via `concurrently`:

- `web` → Vite em http://localhost:5173
- `api` → Express em http://localhost:3006

> ⚠️ Se só o Vite estiver rodando, qualquer chamada a `/api/*` vai
> falhar no proxy com `ECONNREFUSED` e o browser verá `500 Internal
> Server Error`. A API **precisa** estar no ar.

Precisa rodar só um dos dois? `npm run dev:web` ou `npm run dev:api`.

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
| `… /api/tipos-entrada-saida` | CRUD (GET/POST/PUT/DELETE) dos tipos |

Mais detalhes em [`server/README.md`](server/README.md).
