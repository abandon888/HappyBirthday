import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdtemp, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'
import test from 'node:test'
import { PROJECT_ROOT } from '../scripts/lib/config.mjs'

function runNpm(argumentsList) {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', argumentsList, { cwd: PROJECT_ROOT, env: process.env })
    let output = ''
    child.stdout.on('data', (chunk) => { output += chunk })
    child.stderr.on('data', (chunk) => { output += chunk })
    child.on('error', reject)
    child.on('exit', (code) => resolve({ code, output }))
  })
}

test('validate CLI succeeds for the checked-in configuration', async () => {
  const result = await runNpm(['run', 'validate', '--', '--config', 'customize.json'])
  assert.equal(result.code, 0)
  assert.match(result.output, /Configuration is valid/)
})

test('create CLI produces a new site and reports overwrite errors clearly', async () => {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'happy-birthday-cli-'))
  const outputDirectory = path.join(temporaryDirectory, 'site')
  const first = await runNpm(['run', 'create', '--', '--config', 'customize.json', '--output', outputDirectory])
  assert.equal(first.code, 0)
  assert.match(first.output, /Created birthday site/)
  assert.equal(existsSync(path.join(outputDirectory, 'dist', 'index.html')), true)

  const second = await runNpm(['run', 'create', '--', '--config', 'customize.json', '--output', outputDirectory])
  assert.notEqual(second.code, 0)
  assert.match(second.output, /Refusing to overwrite existing directory/)
})

test('invalid configuration causes a nonzero CLI exit and no output directory', async () => {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'happy-birthday-cli-invalid-'))
  const configPath = path.join(temporaryDirectory, 'invalid.json')
  const outputDirectory = path.join(temporaryDirectory, 'site')
  await writeFile(configPath, JSON.stringify({ imagePath: '../private.png' }))

  const result = await runNpm(['run', 'create', '--', '--config', configPath, '--output', outputDirectory])
  assert.notEqual(result.code, 0)
  assert.match(result.output, /Invalid configuration/)
  assert.equal(existsSync(outputDirectory), false)
})
