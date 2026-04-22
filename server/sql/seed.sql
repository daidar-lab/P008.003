-- Vento dashboard seed data

TRUNCATE stats, balance_buckets, performance_weeks, spent_shares,
         spending_categories, revenue_channels, revenue_totals,
         tipos_entrada_saida
RESTART IDENTITY;

INSERT INTO tipos_entrada_saida (codigo, descricao) VALUES
  ('ENT-001', 'Venda à vista'),
  ('ENT-002', 'Venda a prazo'),
  ('ENT-003', 'Recebimento de cliente'),
  ('SAI-001', 'Pagamento a fornecedor'),
  ('SAI-002', 'Folha de pagamento'),
  ('SAI-003', 'Despesa administrativa');

INSERT INTO stats (metric_key, title, dot_color, value, delta_percent, trend) VALUES
  ('total_views', 'Total views', '#e5484d', 253056, 12, 'down'),
  ('customers',   'Customers',   '#d946ef', 12375,   7, 'down'),
  ('orders',      'Orders',      '#19b26b', 23845,  18, 'down');

INSERT INTO performance_weeks (week, new_arrivals, bestsellers, slow_movers) VALUES
  ('W1', 110, 70,  90),
  ('W2', 145, 95,  135),
  ('W3', 185, 159, 210),
  ('W4', 138, 175, 168),
  ('W5', 102, 190, 120);

INSERT INTO spent_shares (category, percent) VALUES
  ('marketing',  72),
  ('operations', 28);

INSERT INTO spending_categories (position, label, icon, color, tint, amount, within_budget) VALUES
  (1, 'Inventory',   'box',       '#e5484d', '#fce7ec', 170.34, TRUE),
  (2, 'Marketing',   'megaphone', '#2f6bff', '#e9f0ff', 52.33,  FALSE),
  (3, 'Payroll',     'wallet',    '#7c5cff', '#f1ebff', 86.23,  FALSE),
  (4, 'Operations',  'hardhat',   '#f5a524', '#fef2e0', 24.64,  TRUE),
  (5, 'Maintenance', 'wrench',    '#19b26b', '#e7f7ee', 19.67,  TRUE);

INSERT INTO revenue_channels (position, name, value, color) VALUES
  (1, 'Online',    45, '#2f6bff'),
  (2, 'Retail',    30, '#19b26b'),
  (3, 'Wholesale', 25, '#f5c518');

INSERT INTO revenue_totals (id, total) VALUES (1, 483000);

-- Balance buckets: 7..13h, channel cycles bank_transfer/momo/cash
INSERT INTO balance_buckets (bucket, hour, channel, amount)
SELECT
  g.i AS bucket,
  7 + (g.i / 5) AS hour,
  CASE
    WHEN 7 + (g.i / 5) < 10 THEN 'bank_transfer'
    WHEN 7 + (g.i / 5) < 12 THEN 'momo'
    ELSE 'cash'
  END AS channel,
  GREATEST(12,
    ROUND(30 + 18 * SIN(g.i::numeric / 3) + (g.i % 5) * 6 + ((g.i * 37) % 22))
  ) AS amount
FROM generate_series(0, 34) AS g(i);
