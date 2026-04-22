import { useEffect } from 'react'

export default function ConfirmDialog({
  title, message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  submitting = false,
  onCancel, onConfirm
}) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>{title}</h2>
        </div>
        <div className="modal-body">
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
            {cancelLabel}
          </button>
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? 'Processando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
