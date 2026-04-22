#!/usr/bin/env node
// Garante que as dependências do server/ estão instaladas.
// É chamado pelo postinstall da raiz e também como passo prévio do dev:api,
// então funciona tanto quando o usuário faz `npm install` quanto quando
// server/node_modules foi apagado manualmente.

import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const serverDir = path.join(here, '..', 'server')

// Usa 'express' como marcador — é a primeira dependência de runtime
// e, se está resolvida, considera-se que `npm install` já rodou.
const marker = path.join(serverDir, 'node_modules', 'express', 'package.json')

if (existsSync(marker)) {
  process.exit(0)
}

console.log('→ server/node_modules ausente, rodando npm install em server/ …')

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const res = spawnSync(
  npmCmd,
  ['install', '--no-audit', '--no-fund'],
  { cwd: serverDir, stdio: 'inherit' }
)

if (res.status !== 0) {
  console.error('✗ npm install em server/ falhou')
  process.exit(res.status ?? 1)
}

console.log('✓ dependências do server instaladas')
