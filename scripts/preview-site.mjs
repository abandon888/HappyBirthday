import { createReadStream, existsSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.otf': 'font/otf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.wav': 'audio/wav',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}

function parseArguments(argumentsList) {
  const values = { port: 4173 }
  for (let index = 0; index < argumentsList.length; index += 1) {
    if (argumentsList[index] === '--site') values.site = argumentsList[++index]
    if (argumentsList[index] === '--port') values.port = Number(argumentsList[++index])
  }
  if (!values.site) throw new Error('Usage: npm run preview -- --site <generated-directory> [--port 4173]')
  if (!Number.isInteger(values.port) || values.port < 1 || values.port > 65535) throw new Error('Port must be between 1 and 65535')
  return values
}

function safeFilePath(root, requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0])
  const requested = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '')
  const file = path.resolve(root, requested)
  const relative = path.relative(root, file)
  if (relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) return null
  return file
}

export async function previewSite({ site, port }) {
  const root = path.resolve(site, 'dist')
  if (!existsSync(root) || !(await stat(root)).isDirectory()) throw new Error(`No dist directory found in ${path.resolve(site)}`)

  const server = http.createServer(async (request, response) => {
    const file = safeFilePath(root, request.url || '/')
    if (!file || !existsSync(file) || !(await stat(file)).isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Not found')
      return
    }

    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    })
    createReadStream(file).pipe(response)
  })

  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', resolve)
  })
  return server
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const options = parseArguments()
    previewSite(options).then(() => {
      console.log(`Preview available at http://127.0.0.1:${options.port}`)
    }).catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
