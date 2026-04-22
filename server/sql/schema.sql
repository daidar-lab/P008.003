-- Vento dashboard schema

CREATE TABLE IF NOT EXISTS stats (
  metric_key    TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  dot_color     TEXT NOT NULL,
  value         NUMERIC NOT NULL,
  delta_percent NUMERIC NOT NULL,
  trend         TEXT NOT NULL CHECK (trend IN ('up', 'down')),
  period        TEXT NOT NULL DEFAULT 'since last month',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS balance_buckets (
  id       SERIAL PRIMARY KEY,
  bucket   INT NOT NULL,              -- 0..N ordered within the day
  hour     INT NOT NULL,              -- 7..13
  channel  TEXT NOT NULL CHECK (channel IN ('bank_transfer', 'momo', 'cash')),
  amount   NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS performance_weeks (
  week          TEXT PRIMARY KEY,
  new_arrivals  NUMERIC NOT NULL,
  bestsellers   NUMERIC NOT NULL,
  slow_movers   NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS spent_shares (
  category  TEXT PRIMARY KEY,
  percent   NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS spending_categories (
  position       INT PRIMARY KEY,
  label          TEXT NOT NULL,
  icon           TEXT NOT NULL,
  color          TEXT NOT NULL,
  tint           TEXT NOT NULL,
  amount         NUMERIC NOT NULL,
  within_budget  BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS revenue_channels (
  position  INT PRIMARY KEY,
  name      TEXT NOT NULL,
  value     NUMERIC NOT NULL,
  color     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS revenue_totals (
  id      INT PRIMARY KEY DEFAULT 1,
  total   NUMERIC NOT NULL,
  CHECK (id = 1)
);

-- Cadastros: tipos de entrada e saída
CREATE TABLE IF NOT EXISTS tipos_entrada_saida (
  id                SERIAL PRIMARY KEY,
  codigo            VARCHAR(50)  NOT NULL UNIQUE,
  descricao         VARCHAR(250) NOT NULL,
  considera_analise BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Migração idempotente para bancos que já tinham a tabela sem a coluna
ALTER TABLE tipos_entrada_saida
  ADD COLUMN IF NOT EXISTS considera_analise BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS tipos_entrada_saida_descricao_idx
  ON tipos_entrada_saida (descricao);
