import { useEffect, useRef, useState } from 'react'

export default function GrupoProdutoForm({ initial, submitting, onCancel, onSave }) {
  const editing = Boolean(initial?.id)
  const [codigo, setCodigo] = useState(initial?.codigo ?? '')
  const [descricao, setDescricao] = useState(initial?.descricao ?? '')
  const [palavraChave, setPalavraChave] = useState(initial?.palavraChave ?? '')
  const [errors, setErrors] = useState({})
  const [banner, setBanner] = useState(null)
  const firstRef = useRef(null)

  useEffect(() => {
    firstRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  function validate() {
    const e = {}
    const c = codigo.trim()
    const d = descricao.trim()
    const p = palavraChave.trim()
    if (!c) e.codigo = 'Código é obrigatório'
    else if (c.length > 50) e.codigo = 'Máximo 50 caracteres'
    if (!d) e.descricao = 'Descrição é obrigatória'
    else if (d.length > 250) e.descricao = 'Máximo 250 caracteres'
    if (!p) e.palavraChave = 'Palavra-chave é obrigatória'
    else if (p.length > 100) e.palavraChave = 'Máximo 100 caracteres'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return

    const result = await onSave({
      codigo: codigo.trim(),
      descricao: descricao.trim(),
      palavraChave: palavraChave.trim()
    })
    if (result && !result.ok) {
      setBanner(result.message || 'Falha ao salvar')
      if (result.fields) setErrors(result.fields)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <form className="modal" onSubmit={handleSubmit}>
        <div className="modal-head">
          <h2>{editing ? 'Editar grupo de produtos' : 'Novo grupo de produtos'}</h2>
          <p>Informe o código, a descrição e a palavra-chave para agrupamento.</p>
        </div>

        <div className="modal-body">
          {banner && <div className="banner">{banner}</div>}

          <div className={`field ${errors.codigo ? 'has-error' : ''}`}>
            <label htmlFor="codigo">Código</label>
            <input
              ref={firstRef}
              id="codigo"
              type="text"
              maxLength={50}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex.: GRP-001"
              autoComplete="off"
            />
            <div className="hint">
              <span className="error-msg">{errors.codigo || ''}</span>
              <span>{codigo.length}/50</span>
            </div>
          </div>

          <div className={`field ${errors.descricao ? 'has-error' : ''}`}>
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              maxLength={250}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex.: Vestuário - Básicos"
              rows={2}
            />
            <div className="hint">
              <span className="error-msg">{errors.descricao || ''}</span>
              <span>{descricao.length}/250</span>
            </div>
          </div>

          <div className={`field ${errors.palavraChave ? 'has-error' : ''}`}>
            <label htmlFor="palavra-chave">Palavra-chave</label>
            <input
              id="palavra-chave"
              type="text"
              maxLength={100}
              value={palavraChave}
              onChange={(e) => setPalavraChave(e.target.value)}
              placeholder="Ex.: camiseta"
              autoComplete="off"
            />
            <div className="hint">
              <span className="error-msg">{errors.palavraChave || ''}</span>
              <span>{palavraChave.length}/100</span>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Salvando…' : (editing ? 'Salvar alterações' : 'Criar')}
          </button>
        </div>
      </form>
    </div>
  )
}
