import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { pool } from '../db.js'

const here = path.dirname(fileURLToPath(import.meta.url))

async function run(file) {
  const sql = await readFile(path.join(here, '..', 'sql', file), 'utf8')
  await pool.query(sql)
  console.log(`✓ applied ${file}`)
}

try {
  await run('schema.sql')
  await run('seed.sql')
} catch (err) {
  console.error('✗ init-db failed:', err.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
