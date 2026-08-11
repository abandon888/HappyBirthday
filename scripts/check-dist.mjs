import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { PROJECT_ROOT } from './lib/config.mjs'

const requiredFiles = [
  'index.html',
  'assets/main.js',
  'customize.json',
  'style/style.css',
  'img/favicon.png',
  'music/bgMusic.mp3',
  'fonts/LXGWWenKai-Regular.ttf'
]

export async function checkDist(directory = path.join(PROJECT_ROOT, 'dist')) {
  for (const file of requiredFiles) await access(path.join(directory, file))

  const index = await readFile(path.join(directory, 'index.html'), 'utf8')
  const bundle = await readFile(path.join(directory, 'assets/main.js'), 'utf8')
  const combined = `${index}\n${bundle}`

  if (combined.includes('cdnjs.cloudflare.com') || combined.includes('TweenMax.min.js')) {
    throw new Error('Production output must not depend on the GSAP CDN')
  }
  if (combined.includes('/Users/') || combined.includes('file://')) {
    throw new Error('Production output must not contain local absolute paths')
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  checkDist().then(() => {
    console.log('Distribution output is complete and self-contained.')
  }).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
