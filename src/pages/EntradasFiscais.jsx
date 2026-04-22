import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Search, RefreshCw, Upload } from 'lucide-react'
import { apiGet, apiSend } from '../api.js'
import { FIELDS, formatValue } from './entradasFiscaisFields.js'
import EntradaFiscalForm from './EntradaFiscalForm.jsx'
import ImportEntradasFiscaisModal from './ImportEntradasFiscaisModal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

const ENDPOINT = '/entradas-fiscais'

export default function EntradasFiscais() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [importing, setImporting] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiGet(ENDPOINT)
      setItems(data)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) =>
      FIELDS.some((f) => String(it[f.name] ?? '').toLowerCase().includes(q))
    )
  }, [items, search])

  async function handleSave(payload) {
    setSubmitting(true)
    try {
      if (editing?.id) await apiSend('PUT', `${ENDPOINT}/${editing.id}`, payload)
      else             await apiSend('POST', ENDPOINT, payload)
      setEditing(null)
      await load()
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e.message, fields: e.fields }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleting) return
    setSubmitting(true)
    try {
      await apiSend('DELETE', `${ENDPOINT}/${deleting.id}`)
      setDeleting(null)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <div className="crumbs">Cadastros</div>
          <h1>Entradas Fiscais</h1>
        </div>
        <div className="actions">
          <button className="btn btn-ghost" onClick={load} aria-label="Recarregar">
            <RefreshCw size={14} />
          </button>
          <button className="btn" onClick={() => setImporting(true)}>
            <Upload size={14} />
            <span>Importar Excel</span>
          </button>
          <button className="btn btn-primary" onClick={() => setEditing({})}>
            <Plus size={15} strokeWidth={2.2} />
            <span>Nova entrada</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <label className="search-input">
            <Search size={14} />
            <input
              type="search"
              placeholder="Buscar por filial, NF, produto, pedido…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <span className="count">
            {loading ? 'Carregando…' : `${filtered.length} registro${filtered.length === 1 ? '' : 's'}`}
          </span>
        </div>

        {error && <div className="banner">Falha ao carregar: {error}</div>}

        <div className="table-wrap">
          <table className="crud-table wide-table">
            <thead>
              <tr>
                <th className="col-id">ID</th>
                {FIELDS.map((f) => (
                  <th key={f.name}
                      style={{
                        minWidth: f.w,
                        textAlign: f.align === 'right' ? 'right' : 'left'
                      }}>
                    {f.label}
                  </th>
                ))}
                <th className="col-actions sticky-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={FIELDS.length + 2}>
                    <div className="empty-state">
                      {search ? 'Nenhum registro encontrado para essa busca.'
                             : 'Nenhuma entrada cadastrada ainda. Clique em "Nova entrada" para criar.'}
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((it) => (
                <tr key={it.id}>
                  <td className="col-id">#{it.id}</td>
                  {FIELDS.map((f) => (
                    <td key={f.name}
                        style={{
                          textAlign: f.align === 'right' ? 'right' : 'left',
                          fontVariantNumeric: f.kind === 'numeric' ? 'tabular-nums' : 'normal'
                        }}>
                      {formatValue(f, it[f.name])}
                    </td>
                  ))}
                  <td className="col-actions sticky-right">
                    <button className="row-action" aria-label="Editar" title="Editar" onClick={() => setEditing(it)}>
                      <Pencil size={15} />
                    </button>
                    <button className="row-action danger" aria-label="Excluir" title="Excluir" onClick={() => setDeleting(it)}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <EntradaFiscalForm
          initial={editing}
          submitting={submitting}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {importing && (
        <ImportEntradasFiscaisModal
          onCancel={() => setImporting(false)}
          onImported={load}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Excluir registro"
          message={<>Tem certeza que deseja excluir a entrada <strong>#{deleting.id}</strong> (NF {deleting.numeroDocumentoFiscal}/{deleting.serieDocumentoFiscal || '—'} · item {deleting.itemDocumentoFiscal})?</>}
          confirmLabel="Excluir"
          danger
          submitting={submitting}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  )
}
