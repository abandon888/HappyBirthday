import assert from 'node:assert/strict'
import { mkdtemp, truncate, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { RESOURCE_RULES, validateConfigObject } from '../scripts/lib/config.mjs'

test('accepts all supported themes and defaults classic', async () => {
  for (const theme of ['classic', 'warm', 'minimal']) {
    const result = await validateConfigObject({ theme })
    assert.deepEqual(result.errors, [])
    assert.equal(result.config.theme, theme)
  }

  const result = await validateConfigObject({ name: 'Ada' })
  assert.deepEqual(result.errors, [])
  assert.equal(result.config.theme, 'classic')
})

test('rejects unsafe remote resource protocols', async () => {
  const result = await validateConfigObject({ music: 'javascript:alert(1)' })
  assert.match(result.errors.join('\n'), /must use HTTPS/)
})

test('rejects a resource path that escapes its configuration directory', async () => {
  const result = await validateConfigObject({ imagePath: '../private.png' }, { configDirectory: process.cwd() })
  assert.match(result.errors.join('\n'), /must not escape/)
})

test('rejects missing and oversized local assets', async () => {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'happy-birthday-config-'))
  const missing = await validateConfigObject({ imagePath: 'missing.png' }, { configDirectory: temporaryDirectory })
  assert.match(missing.errors.join('\n'), /does not exist/)

  const largeImage = path.join(temporaryDirectory, 'large.png')
  await writeFile(largeImage, '')
  await truncate(largeImage, RESOURCE_RULES.imagePath.maxBytes + 1)
  const oversized = await validateConfigObject({ imagePath: 'large.png' }, { configDirectory: temporaryDirectory })
  assert.match(oversized.errors.join('\n'), /exceeds/)
})

test('accepts an HTTPS font and a Unicode local filename', async () => {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'happy-birthday-config-'))
  await writeFile(path.join(temporaryDirectory, '生日.png'), 'fixture')
  const result = await validateConfigObject({
    imagePath: '生日.png',
    fonts: [{ name: 'Remote Font', path: 'https://fonts.example.com/font.css' }]
  }, { configDirectory: temporaryDirectory })
  assert.deepEqual(result.errors, [])
})
