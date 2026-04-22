// Centraliza os 16 campos de Entradas Fiscais — usado pela tabela, pelo
// form e pelo modal de import. section agrupa campos no form.
export const FIELDS = [
  // Documento Fiscal
  { name: 'codigoFilial',            label: 'Código da filial',            kind: 'string',  section: 'Documento Fiscal', maxLen: 20,  required: true,  w: 90 },
  { name: 'numeroDocumentoFiscal',   label: 'Número do documento fiscal',  kind: 'string',  section: 'Documento Fiscal', maxLen: 20,  required: true,  w: 130 },
  { name: 'serieDocumentoFiscal',    label: 'Série',                        kind: 'string',  section: 'Documento Fiscal', maxLen: 10,  w: 70 },
  { name: 'itemDocumentoFiscal',     label: 'Item do documento',            kind: 'string',  section: 'Documento Fiscal', maxLen: 10,  required: true,  w: 90 },
  { name: 'dataEmissaoNotaFiscal',   label: 'Data de emissão',              kind: 'date',    section: 'Documento Fiscal', w: 120 },

  // Produto
  { name: 'codigoProduto',           label: 'Código do produto',            kind: 'string',  section: 'Produto', maxLen: 50, required: true,  w: 120 },
  { name: 'descricaoProduto',        label: 'Descrição do produto',          kind: 'string',  section: 'Produto', maxLen: 250, w: 240, multiline: true },

  // Pedido de Compras
  { name: 'numeroPedidoCompras',     label: 'Número do pedido de compras',  kind: 'string',  section: 'Pedido de Compras', maxLen: 30, w: 140 },
  { name: 'tipoPedidoCompras',       label: 'Tipo do pedido de compras',    kind: 'string',  section: 'Pedido de Compras', maxLen: 20, w: 120 },

  // Quantidades e Valores
  { name: 'quantidadeEscriturada',   label: 'Qtd. escriturada (NF)',        kind: 'numeric', section: 'Quantidades e Valores', w: 120, align: 'right' },
  { name: 'quantidadePedidoCompras', label: 'Qtd. pedido de compras',       kind: 'numeric', section: 'Quantidades e Valores', w: 120, align: 'right' },
  { name: 'valorNotaFiscal',         label: 'Valor emitido na NF (fornecedor)', kind: 'numeric', section: 'Quantidades e Valores', w: 150, align: 'right', money: true },
  { name: 'valorNegociadoCompras',   label: 'Valor negociado (compras)',     kind: 'numeric', section: 'Quantidades e Valores', w: 150, align: 'right', money: true },
  { name: 'valorEntradaNf',          label: 'Valor de entrada (NF)',         kind: 'numeric', section: 'Quantidades e Valores', w: 150, align: 'right', money: true },

  // Tipo de Entrada
  { name: 'codigoTipoEntrada',       label: 'Código do tipo de entrada',    kind: 'string',  section: 'Tipo de Entrada', maxLen: 50, w: 120 },
  { name: 'descricaoTipoEntrada',    label: 'Descrição do tipo de entrada',  kind: 'string',  section: 'Tipo de Entrada', maxLen: 250, w: 200 }
]

export const SECTIONS = Array.from(new Set(FIELDS.map(f => f.section)))

export function formatValue(f, v) {
  if (v === null || v === undefined || v === '') return ''
  if (f.kind === 'numeric') {
    const n = Number(v)
    if (!Number.isFinite(n)) return String(v)
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: f.money ? 2 : 0,
      maximumFractionDigits: f.money ? 2 : 4
    }).format(n)
  }
  if (f.kind === 'date') {
    const s = String(v).slice(0, 10)
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s)
    return m ? `${m[3]}/${m[2]}/${m[1]}` : s
  }
  return String(v)
}
