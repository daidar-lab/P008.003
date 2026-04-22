import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { pool } from '../db.js'

const here = path.dirname(fileURLToPath(import.meta.url))

try {
  const sql = await readFile(path.join(here, '..', 'sql', 'seed.sql'), 'utf8')
  await pool.query(sql)
  console.log('✓ seed applied')
} catch (err) {
  console.error('✗ seed failed:', err.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
