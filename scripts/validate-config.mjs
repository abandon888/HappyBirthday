import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { formatErrors, validateConfigFile } from './lib/config.mjs'

function parseArguments(argumentsList) {
  const configFlag = argumentsList.indexOf('--config')
  if (configFlag === -1 || !argumentsList[configFlag + 1]) {
    throw new Error('Usage: npm run validate -- --config <file>')
  }
  return path.resolve(argumentsList[configFlag + 1])
}

export async function validateCommand(argumentsList = process.argv.slice(2)) {
  const configPath = parseArguments(argumentsList)
  const result = await validateConfigFile(configPath)
  if (result.errors.length > 0) throw new Error(`Invalid configuration:\n${formatErrors(result.errors)}`)
  return result
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  validateCommand().then(({ configPath }) => {
    console.log(`Configuration is valid: ${configPath}`)
  }).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
