import assert from 'node:assert/strict'
import { mkdtemp, readFile, symlink, truncate, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { PROJECT_ROOT, RESOURCE_RULES, validateConfigObject } from '../scripts/lib/config.mjs'

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

test('accepts a complete legacy configuration without a theme field', async () => {
  const legacy = JSON.parse(await readFile(path.join(PROJECT_ROOT, 'customize.json'), 'utf8'))
  delete legacy.theme
  const result = await validateConfigObject(legacy, { configDirectory: PROJECT_ROOT })
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

test('rejects absolute asset paths', async () => {
  const result = await validateConfigObject({ imagePath: '/tmp/private.png' })
  assert.match(result.errors.join('\n'), /must not escape/)
})

test('rejects a config-local symlink that targets an external asset', async () => {
  const configDirectory = await mkdtemp(path.join(os.tmpdir(), 'happy-birthday-config-'))
  const externalDirectory = await mkdtemp(path.join(os.tmpdir(), 'happy-birthday-external-'))
  const externalAsset = path.join(externalDirectory, 'private.png')
  await writeFile(externalAsset, 'not a local asset')
  await symlink(externalAsset, path.join(configDirectory, 'photo.png'))

  const result = await validateConfigObject({ imagePath: 'photo.png' }, { configDirectory })
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

  const largeAudio = path.join(temporaryDirectory, 'large.mp3')
  await writeFile(largeAudio, '')
  await truncate(largeAudio, RESOURCE_RULES.music.maxBytes + 1)
  const oversizedAudio = await validateConfigObject({ music: 'large.mp3' }, { configDirectory: temporaryDirectory })
  assert.match(oversizedAudio.errors.join('\n'), /exceeds/)

  const largeFont = path.join(temporaryDirectory, 'large.ttf')
  await writeFile(largeFont, '')
  await truncate(largeFont, RESOURCE_RULES.font.maxBytes + 1)
  const oversizedFont = await validateConfigObject({ fonts: [{ name: 'Large', path: 'large.ttf' }] }, { configDirectory: temporaryDirectory })
  assert.match(oversizedFont.errors.join('\n'), /exceeds/)
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

test('ships a browser font loader for binary font files', async () => {
  const mainScript = await readFile(path.join(PROJECT_ROOT, 'script', 'main.js'), 'utf8')
  assert.match(mainScript, /new FontFace/)
  assert.match(mainScript, /document\.fonts\.add/)
})
