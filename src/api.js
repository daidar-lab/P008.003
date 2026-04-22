import { useEffect, useState } from 'react'

const BASE = import.meta.env.VITE_API_BASE || '/api'

export async function apiGet(path, { signal } = {}) {
  const res = await fetch(`${BASE}${path}`, { signal })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`API ${res.status} on ${path}: ${body}`)
  }
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
