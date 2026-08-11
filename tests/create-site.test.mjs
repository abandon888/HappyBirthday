import assert from 'node:assert/strict'
import { access, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { checkDist } from '../scripts/check-dist.mjs'
import { createSite } from '../scripts/create-site.mjs'
import { PROJECT_ROOT } from '../scripts/lib/config.mjs'
import { previewSite } from '../scripts/preview-site.mjs'

test('creates an editable, self-contained site and refuses a second overwrite', async () => {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'happy-birthday-create-'))
  const outputDirectory = path.join(temporaryDirectory, 'birthday-site')
  const result = await createSite({
    configPath: path.join(PROJECT_ROOT, 'customize.json'),
    outputDirectory
  })

  assert.equal(result.config.theme, 'classic')
  await access(path.join(outputDirectory, 'package.json'))
  await access(path.join(outputDirectory, 'GENERATED.md'))
  await access(path.join(outputDirectory, 'dist', 'index.html'))
  await checkDist(path.join(outputDirectory, 'dist'))

  const generatedConfig = JSON.parse(await readFile(path.join(outputDirectory, 'customize.json'), 'utf8'))
  assert.equal(generatedConfig.imagePath, 'img/lydia2.png')
  assert.equal(generatedConfig.music, 'music/bgMusic.mp3')

  await assert.rejects(
    () => createSite({ configPath: path.join(PROJECT_ROOT, 'customize.json'), outputDirectory }),
    /Refusing to overwrite/
  )
})

test('copies user-owned local assets into a generated project', async () => {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'happy-birthday-assets-'))
  await writeFile(path.join(temporaryDirectory, '生日照片.png'), 'image fixture')
  await writeFile(path.join(temporaryDirectory, 'song.mp3'), 'audio fixture')
  await writeFile(path.join(temporaryDirectory, 'customize.json'), JSON.stringify({
    theme: 'minimal',
    name: 'Avery',
    wishText: 'Happy birthday, Avery!',
    imagePath: './生日照片.png',
    music: './song.mp3',
    fonts: []
  }))

  const outputDirectory = path.join(temporaryDirectory, 'site')
  const result = await createSite({
    configPath: path.join(temporaryDirectory, 'customize.json'),
    outputDirectory
  })

  assert.equal(result.config.theme, 'minimal')
  assert.match(result.config.imagePath, /^assets\/user\//)
  assert.match(result.config.music, /^assets\/user\//)
  await access(path.join(outputDirectory, result.config.imagePath))
  await access(path.join(outputDirectory, result.config.music))
})

test('does not leave a partial directory after validation failure', async () => {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'happy-birthday-invalid-'))
  const configPath = path.join(temporaryDirectory, 'invalid.json')
  const outputDirectory = path.join(temporaryDirectory, 'site')
  await writeFile(configPath, JSON.stringify({ imagePath: '../private.png' }))

  await assert.rejects(() => createSite({ configPath, outputDirectory }), /Invalid configuration/)
  assert.equal(existsSync(outputDirectory), false)
})

test('serves a generated distribution on localhost only', async (context) => {
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'happy-birthday-preview-'))
  const outputDirectory = path.join(temporaryDirectory, 'site')
  await createSite({ configPath: path.join(PROJECT_ROOT, 'customize.json'), outputDirectory })

  const server = await previewSite({ site: outputDirectory, port: 0 })
  context.after(() => server.close())
  const { port } = server.address()
  const body = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/`, (response) => {
      let result = ''
      response.setEncoding('utf8')
      response.on('data', (chunk) => { result += chunk })
      response.on('end', () => resolve(result))
    }).on('error', reject)
  })

  assert.ok(body.includes('<title>生日快乐!!! :)</title>'))
})
