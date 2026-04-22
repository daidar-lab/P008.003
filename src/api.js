import { useEffect, useState } from 'react'

const BASE = import.meta.env.VITE_API_BASE || '/api'

async function parseError(res, path) {
  const body = await res.text().catch(() => '')
  let msg = body
  let payload = null
  try { payload = JSON.parse(body) } catch {}
  if (payload) {
    msg = payload.message || payload.error || body
  }
  // Vite proxy error when the API is offline comes back as 500 text/plain
  // with "AggregateError" / "ECONNREFUSED" — rewrite to something actionable.
  if (!payload && /ECONNREFUSED|AggregateError|socket hang up/i.test(body)) {
    msg = 'API indisponível. Verifique se o servidor em :3006 está rodando (npm run dev:api).'
  }
  const err = new Error(msg || `HTTP ${res.status}`)
  err.status = res.status
  err.path = path
  if (payload?.fields) err.fields = payload.fields
  return err
}

export async function apiGet(path, { signal } = {}) {
  const res = await fetch(`${BASE}${path}`, { signal })
  if (!res.ok) throw await parseError(res, path)
  return res.json()
}

export async function apiSend(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body != null ? JSON.stringify(body) : undefined
  })
  if (res.status === 204) return null
  if (!res.ok) throw await parseError(res, path)
  return res.json()
}

export function useApi(path, { fallback = null } = {}) {
  const [data, setData] = useState(fallback)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ctrl = new AbortController()
    setLoading(true)
    apiGet(path, { signal: ctrl.signal })
      .then((d) => { setData(d); setError(null) })
      .catch((e) => {
        if (e.name !== 'AbortError') {
          console.warn('[api]', e.message)
          setError(e)
        }
      })
      .finally(() => setLoading(false))
    return () => ctrl.abort()
  }, [path])

  return { data, error, loading }
}
