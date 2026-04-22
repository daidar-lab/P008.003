# Audit Supply API

Camada HTTP em Node.js (Express) que expõe os dados do dashboard a partir
de um banco **PostgreSQL**, usando o cliente `pg` via pool de conexões.

## Pré-requisitos

- Node.js 20+
- PostgreSQL 14+ em execução

## Configuração

Copie o exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

Por padrão a aplicação se conecta à database **`postgres`** (a que já
existe em qualquer instalação do Postgres). Você pode apontar para
qualquer outra database editando `.env`:

```
# a aplicação cria as tabelas necessárias na database que você apontar
DATABASE_URL=postgres://user:password@localhost:5432/postgres
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

## Banco de dados

O servidor aplica o `sql/schema.sql` **automaticamente no startup**
(idempotente, todos os `CREATE TABLE` usam `IF NOT EXISTS`). Basta ter
o Postgres acessível — não precisa criar a database nem rodar script
manual.

Se quiser popular dados de exemplo (dashboard + alguns "Tipos de
Entrada/Saída"):

```bash
npm run db:seed     # TRUNCATE + INSERT nos dados de exemplo
```

Alternativa explícita com `psql`:

```bash
psql "$DATABASE_URL" -f sql/schema.sql
psql "$DATABASE_URL" -f sql/seed.sql
```

## Executando

```bash
npm run dev        # node --watch
npm start          # produção
```

Saída esperada no boot:

```
✓ schema ensured
▲ Audit Supply API on http://localhost:3001
```

## Endpoints

| Método | Rota                  | Descrição                                       |
|--------|-----------------------|-------------------------------------------------|
| GET    | `/api/health`         | Liveness + ping no Postgres                     |
| GET    | `/api/stats`          | Cards: Total views, Customers, Orders           |
| GET    | `/api/total-balance`  | Série horária para o gráfico de barras          |
| GET    | `/api/performance`    | Semanas W1..W5 (arrivals/best/slow)             |
| GET    | `/api/spent-amount`   | Donut 72% (Marketing x Operations)              |
| GET    | `/api/spending`       | Tabela de categorias                            |
| GET    | `/api/revenue`        | Gauge Online/Retail/Wholesale + total           |
| GET    | `/api/tipos-entrada-saida`       | Lista de tipos (filtro `?q=`)        |
| GET    | `/api/tipos-entrada-saida/:id`   | Busca um tipo por ID                 |
| POST   | `/api/tipos-entrada-saida`       | Cria `{ codigo, descricao }`         |
| PUT    | `/api/tipos-entrada-saida/:id`   | Atualiza `{ codigo, descricao }`     |
| DELETE | `/api/tipos-entrada-saida/:id`   | Remove um tipo                       |

Todas respondem JSON, já no shape consumido pelos componentes React.

## Proxy no frontend

O `vite.config.js` faz proxy de `/api` para `http://localhost:3001`,
então no dev basta subir os dois processos (server + Vite) e o frontend
consome as rotas transparentemente.
