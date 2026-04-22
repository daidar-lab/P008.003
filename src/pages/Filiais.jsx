import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, RefreshCw, Upload } from 'lucide-react'
import { apiGet, apiSend } from '../api.js'
import FilialForm from './FilialForm.jsx'
import ImportFiliaisModal from './ImportFiliaisModal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import DataTable from '../components/DataTable.jsx'

const ENDPOINT = '/filiais'

export default function Filiais() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

  const columns = useMemo(() => ([
    { key: 'id', label: 'ID', kind: 'number', className: 'col-id', minWidth: 60,
      format: (v) => `#${v}` },
    { key: 'codigo', label: 'Código', className: 'col-code', minWidth: 120 },
    { key: 'descricao', label: 'Descrição' },
    { key: 'abreviatura', label: 'Abreviatura', minWidth: 140 },
    {
      key: '__actions', label: 'Ações', className: 'col-actions', sortable: false, filterable: false,
      render: (row) => (
        <>
          <button className="row-action" aria-label="Editar" title="Editar" onClick={() => setEditing(row)}>
            <Pencil size={15} />
          </button>
          <button className="row-action danger" aria-label="Excluir" title="Excluir" onClick={() => setDeleting(row)}>
            <Trash2 size={15} />
          </button>
        </>
      )
    }
  ]), [])

  return (
    <>
      <div className="page-header">
        <div>
          <div className="crumbs">Cadastros</div>
          <h1>Filiais</h1>
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
            <span>Nova filial</span>
          </button>
        </div>
      </div>

      <div className="card">
        <div className="toolbar">
          <span className="count">
            {loading ? 'Carregando…' : `${items.length} registro${items.length === 1 ? '' : 's'}`}
          </span>
        </div>

        {error && <div className="banner">Falha ao carregar: {error}</div>}

        <DataTable
          columns={columns}
          rows={items}
          loading={loading}
          emptyMessage='Nenhuma filial cadastrada ainda. Clique em "Nova filial" para criar a primeira.'
          defaultSort={{ key: 'id', dir: 'asc' }}
        />
      </div>

      {editing && (
        <FilialForm
          initial={editing}
          submitting={submitting}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {importing && (
        <ImportFiliaisModal
          onCancel={() => setImporting(false)}
          onImported={load}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Excluir filial"
          message={<>Tem certeza que deseja excluir <strong>{deleting.codigo} — {deleting.descricao}</strong>? Essa ação não pode ser desfeita.</>}
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
