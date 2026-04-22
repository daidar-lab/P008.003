import { useEffect, useMemo, useState } from 'react'
import {
  ChevronUp, ChevronDown, ChevronsUpDown, X,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react'

/**
 * Tabela com ordenação e filtros por coluna.
 *
 * columns: Array<{
 *   key: string,                   // chave no objeto row (ou id para a coluna de ações)
 *   label: string,                 // título do cabeçalho
 *   kind?: 'string'|'number'|'date'|'boolean',
 *   className?: string,
 *   minWidth?: number,
 *   align?: 'left'|'right'|'center',
 *   sortable?: boolean,            // default true (exceto se render for passado sem accessor)
 *   filterable?: boolean,          // default true
 *   filterKind?: 'text'|'select',
 *   filterOptions?: Array<{value, label}>,   // para 'select'
 *   accessor?: (row) => any,       // custom getter para ordenar/filtrar
 *   format?: (value, row) => any,  // como formatar o valor exibido
 *   render?: (row) => ReactNode,   // render totalmente customizado (ex. botões)
 *   sticky?: 'right',
 * }>
 */
const DEFAULT_PAGE_SIZES = [25, 50, 100, 200, 500]

export default function DataTable({
  columns,
  rows,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado.',
  defaultSort = null,
  wide = false,
  defaultPageSize = 25,
  pageSizeOptions = DEFAULT_PAGE_SIZES
}) {
  const [sort, setSort] = useState(defaultSort)
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)

  const activeFilters = Object.entries(filters).filter(([, v]) => v && String(v).trim() !== '' && v !== '__all__')

  const filtered = useMemo(() => {
    if (activeFilters.length === 0) return rows
    return rows.filter((row) =>
      activeFilters.every(([key, value]) => {
        const col = columns.find((c) => c.key === key)
        if (!col) return true
        const raw = col.accessor ? col.accessor(row) : row[key]
        if (col.filterKind === 'select') {
          return String(raw) === String(value)
        }
        const needle = String(value).toLowerCase()
        const rawStr = raw === null || raw === undefined ? '' : String(raw)
        if (rawStr.toLowerCase().includes(needle)) return true
        if (col.format) {
          const formatted = col.format(raw, row)
          if (typeof formatted === 'string' && formatted.toLowerCase().includes(needle)) return true
        }
        return false
      })
    )
  }, [rows, columns, activeFilters])

  const sorted = useMemo(() => {
    if (!sort) return filtered
    const col = columns.find((c) => c.key === sort.key)
    if (!col) return filtered
    const accessor = col.accessor ? col.accessor : (row) => row[sort.key]
    const mul = sort.dir === 'desc' ? -1 : 1
    return [...filtered].sort((a, b) => {
      const av = accessor(a)
      const bv = accessor(b)
      if (av === bv) return 0
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * mul
      if (typeof av === 'boolean' && typeof bv === 'boolean') return (Number(av) - Number(bv)) * mul
      const as = String(av).toLowerCase()
      const bs = String(bv).toLowerCase()
      return as < bs ? -mul : as > bs ? mul : 0
    })
  }, [filtered, columns, sort])

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const end = Math.min(start + pageSize, total)
  const paginated = useMemo(() => sorted.slice(start, end), [sorted, start, end])

  useEffect(() => {
    // Quando filtro/ordenação mudam o total, volta para a página 1.
    setPage(1)
  }, [activeFilters.length, sort?.key, sort?.dir, pageSize])

  function toggleSort(key) {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' }
      if (prev.dir === 'asc') return { key, dir: 'desc' }
      return null
    })
  }

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function clearAll() {
    setFilters({})
  }

  const hasFilters = activeFilters.length > 0

  const pageNumbers = buildPageNumbers(currentPage, totalPages)

  return (
    <div className={`dt-wrap ${wide ? 'table-wrap' : ''}`}>
      <table className={`crud-table ${wide ? 'wide-table' : ''}`}>
        <thead>
          <tr>
            {columns.map((col) => {
              const sortable = col.sortable !== false && col.key !== '__actions'
              const isActive = sort?.key === col.key
              return (
                <th
                  key={col.key}
                  className={`${col.className || ''} ${col.sticky === 'right' ? 'sticky-right' : ''}`}
                  style={{
                    minWidth: col.minWidth,
                    textAlign: col.align || (col.kind === 'number' ? 'right' : 'left'),
                    cursor: sortable ? 'pointer' : 'default',
                    userSelect: sortable ? 'none' : 'auto'
                  }}
                  onClick={sortable ? () => toggleSort(col.key) : undefined}
                  aria-sort={isActive ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <span className="th-inner" style={{ justifyContent: (col.align === 'right') ? 'flex-end' : 'flex-start' }}>
                    <span>{col.label}</span>
                    {sortable && (
                      <span className={`sort-ind ${isActive ? '' : 'sort-ind-dim'}`}>
                        {isActive
                          ? (sort.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
                          : <ChevronsUpDown size={12} />}
                      </span>
                    )}
                  </span>
                </th>
              )
            })}
          </tr>

          <tr className="filter-row">
            {columns.map((col, idx) => {
              const isActions = col.key === '__actions'
              const filterable = col.filterable !== false && !isActions
              return (
                <th
                  key={col.key}
                  className={`filter-cell ${col.className || ''} ${col.sticky === 'right' ? 'sticky-right' : ''}`}
                >
                  {!filterable
                    ? (idx === columns.length - 1 && hasFilters
                        ? <button type="button"
                                  className="filter-clear"
                                  title="Limpar todos os filtros"
                                  onClick={clearAll}>
                            <X size={13} />
                          </button>
                        : <span className="filter-placeholder" />)
                    : col.filterKind === 'select'
                      ? (
                        <select
                          value={filters[col.key] ?? '__all__'}
                          onChange={(e) => setFilter(col.key, e.target.value)}
                          className="col-filter-select"
                        >
                          <option value="__all__">Todos</option>
                          {col.filterOptions?.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      )
                      : (
                        <input
                          type="text"
                          placeholder="filtrar…"
                          value={filters[col.key] ?? ''}
                          onChange={(e) => setFilter(col.key, e.target.value)}
                          className="col-filter-input"
                        />
                      )
                  }
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {!loading && total === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <div className="empty-state">
                  {hasFilters ? 'Nenhum registro encontrado para esses filtros.' : emptyMessage}
                </div>
              </td>
            </tr>
          )}
          {paginated.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((col) => {
                const raw = col.accessor ? col.accessor(row) : row[col.key]
                const content = col.render
                  ? col.render(row)
                  : col.format
                    ? col.format(raw, row)
                    : (raw === null || raw === undefined ? '' : String(raw))
                return (
                  <td
                    key={col.key}
                    className={`${col.className || ''} ${col.sticky === 'right' ? 'sticky-right' : ''}`}
                    style={{
                      textAlign: col.align || (col.kind === 'number' ? 'right' : 'left'),
                      fontVariantNumeric: col.kind === 'number' ? 'tabular-nums' : undefined
                    }}
                  >
                    {content}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="dt-pagination">
        <div className="dt-range">
          {total === 0
            ? 'Nenhum registro'
            : <>Mostrando <strong>{fmt(start + 1)}</strong>–<strong>{fmt(end)}</strong> de <strong>{fmt(total)}</strong> registros</>
          }
        </div>

        <div className="dt-pagesize">
          <label htmlFor="dt-psize">Por página:</label>
          <select
            id="dt-psize"
            className="col-filter-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="dt-pager">
          <button type="button" className="dt-pg-btn" title="Primeira"
                  onClick={() => setPage(1)} disabled={currentPage <= 1}>
            <ChevronsLeft size={14} />
          </button>
          <button type="button" className="dt-pg-btn" title="Anterior"
                  onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>
            <ChevronLeft size={14} />
          </button>
          {pageNumbers.map((p, i) =>
            p === '…'
              ? <span key={`e${i}`} className="dt-pg-ellipsis">…</span>
              : <button
                  key={p}
                  type="button"
                  className={`dt-pg-btn ${p === currentPage ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
          )}
          <button type="button" className="dt-pg-btn" title="Próxima"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
            <ChevronRight size={14} />
          </button>
          <button type="button" className="dt-pg-btn" title="Última"
                  onClick={() => setPage(totalPages)} disabled={currentPage >= totalPages}>
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

const fmt = (n) => new Intl.NumberFormat('pt-BR').format(n)

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (current > 4) pages.push('…')
  const from = Math.max(2, current - 1)
  const to   = Math.min(total - 1, current + 1)
  for (let p = from; p <= to; p++) pages.push(p)
  if (current < total - 3) pages.push('…')
  pages.push(total)
  return pages
}
