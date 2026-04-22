import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg

const config = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'postgres'
    }

export const pool = new Pool({
  ...config,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000
})

pool.on('error', (err) => {
  console.error('[pg] idle client error:', err.message)
})

export async function query(text, params) {
  const start = Date.now()
  const res = await pool.query(text, params)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[pg] ${Date.now() - start}ms rows=${res.rowCount} ${text.split('\n')[0]}`)
  }
  return res
}
