import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, RefreshCw, Upload, Layers } from 'lucide-react'
import { apiGet, apiSend } from '../api.js'
import { FIELDS, formatValue } from './entradasFiscaisFields.js'
import EntradaFiscalForm from './EntradaFiscalForm.jsx'
import ImportEntradasFiscaisModal from './ImportEntradasFiscaisModal.jsx'
import ClassificarGruposModal from './ClassificarGruposModal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import DataTable from '../components/DataTable.jsx'

const ENDPOINT = '/entradas-fiscais'

export default function EntradasFiscais() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [importing, setImporting] = useState(false)
  const [classifying, setClassifying] = useState(false)
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
    {
      key: 'id', label: 'ID', kind: 'number',
      className: 'col-id', minWidth: 70,
      format: (v) => `#${v}`
    },
    ...FIELDS.map((f) => ({
      key: f.name,
      label: f.label,
      kind: f.kind === 'numeric' ? 'number' : (f.kind === 'date' ? 'date' : 'string'),
      align: f.align || (f.kind === 'numeric' ? 'right' : 'left'),
      minWidth: f.w,
      format: (v) => formatValue(f, v)
    })),
    {
      key: 'grupoCodigo', label: 'Grupo', minWidth: 160,
      accessor: (row) => row.grupoCodigo || '',
      format: (_, row) => row.grupoCodigo
        ? <span className="grupo-pill" title={row.grupoDescricao || ''}>
            <Layers size={11} /> {row.grupoCodigo}
          </span>
        : <span className="nf-muted">—</span>
    },
    {
      key: '__actions', label: 'Ações', className: 'col-actions sticky-right',
      sticky: 'right', sortable: false, filterable: false,
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
          <h1>Entradas Fiscais</h1>
        </div>
        <div className="actions">
          <button className="btn btn-ghost" onClick={load} aria-label="Recarregar">
            <RefreshCw size={14} />
          </button>
          <button className="btn" onClick={() => setClassifying(true)} title="Classificar itens por grupo">
            <Layers size={14} />
            <span>Classificar grupos</span>
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
          <span className="count">
            {loading ? 'Carregando…' : `${items.length} registro${items.length === 1 ? '' : 's'}`}
          </span>
        </div>

        {error && <div className="banner">Falha ao carregar: {error}</div>}

        <DataTable
          columns={columns}
          rows={items}
          loading={loading}
          wide
          emptyMessage='Nenhuma entrada cadastrada ainda. Clique em "Nova entrada" para criar.'
          defaultSort={{ key: 'id', dir: 'desc' }}
        />
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

      {classifying && (
        <ClassificarGruposModal
          onClose={() => setClassifying(false)}
          onDone={load}
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
