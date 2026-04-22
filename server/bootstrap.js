import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { pool } from './db.js'

const here = path.dirname(fileURLToPath(import.meta.url))

export async function ensureSchema() {
  const sql = await readFile(path.join(here, 'sql', 'schema.sql'), 'utf8')
  await pool.query(sql)
  console.log('✓ schema ensured')
}
