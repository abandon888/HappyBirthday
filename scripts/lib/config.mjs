import { stat, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv from 'ajv/dist/2020.js'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
export const PROJECT_ROOT = path.resolve(scriptDirectory, '../..')

const schema = JSON.parse(await readFile(path.join(PROJECT_ROOT, 'customize.schema.json'), 'utf8'))
const ajv = new Ajv({ allErrors: true, strict: false, useDefaults: true })
const validateSchema = ajv.compile(schema)

export const RESOURCE_RULES = {
  imagePath: {
    extensions: new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']),
    maxBytes: 10 * 1024 * 1024,
    label: 'image'
  },
  music: {
    extensions: new Set(['.mp3', '.ogg', '.wav', '.m4a']),
    maxBytes: 25 * 1024 * 1024,
    label: 'audio'
  },
  font: {
    extensions: new Set(['.ttf', '.otf', '.woff', '.woff2']),
    maxBytes: 10 * 1024 * 1024,
    label: 'font'
  }
}

export function isHttpsUrl(value) {
  if (typeof value !== 'string') return false
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function hasProtocol(value) {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)
}

function isInside(candidate, parent) {
  const relative = path.relative(parent, candidate)
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
}

export function resolveLocalResource(value, configDirectory) {
  if (typeof value !== 'string' || value.trim() === '' || isHttpsUrl(value)) return null
  if (hasProtocol(value)) return null

  const resolved = path.resolve(configDirectory, value)
  if (!path.isAbsolute(value) && !isInside(resolved, configDirectory)) return null
  return resolved
}

async function validateResource(value, rule, configDirectory, fieldName) {
  const errors = []
  if (typeof value !== 'string' || value.trim() === '') return errors

  if (hasProtocol(value)) {
    if (!isHttpsUrl(value)) errors.push(`${fieldName} must use HTTPS when it is a remote URL`)
    return errors
  }

  const resourcePath = resolveLocalResource(value, configDirectory)
  if (!resourcePath) {
    errors.push(`${fieldName} must not escape the configuration directory`)
    return errors
  }

  const extension = path.extname(resourcePath).toLowerCase()
  if (!rule.extensions.has(extension)) {
    errors.push(`${fieldName} must be a supported ${rule.label} file`)
    return errors
  }

  try {
    const file = await stat(resourcePath)
    if (!file.isFile()) errors.push(`${fieldName} must point to a file`)
    else if (file.size > rule.maxBytes) errors.push(`${fieldName} exceeds the ${rule.maxBytes} byte limit`)
  } catch {
    errors.push(`${fieldName} does not exist: ${value}`)
  }

  return errors
}

export async function validateConfigObject(input, { configDirectory = PROJECT_ROOT } = {}) {
  const config = structuredClone(input)
  const errors = []

  if (!validateSchema(config)) {
    errors.push(...validateSchema.errors.map((error) => `schema${error.instancePath || '/'} ${error.message}`))
  }

  if (config && typeof config === 'object' && !Array.isArray(config)) {
    errors.push(...await validateResource(config.imagePath, RESOURCE_RULES.imagePath, configDirectory, 'imagePath'))
    errors.push(...await validateResource(config.music, RESOURCE_RULES.music, configDirectory, 'music'))

    if (Array.isArray(config.fonts)) {
      for (const [index, font] of config.fonts.entries()) {
        if (font?.path) {
          errors.push(...await validateResource(font.path, RESOURCE_RULES.font, configDirectory, `fonts[${index}].path`))
        }
      }
    }
  }

  return { config, errors }
}

export async function validateConfigFile(configPath) {
  const absoluteConfigPath = path.resolve(configPath)
  let input

  try {
    input = JSON.parse(await readFile(absoluteConfigPath, 'utf8'))
  } catch (error) {
    return { config: null, errors: [`Could not read JSON configuration: ${error.message}`], configPath: absoluteConfigPath }
  }

  const result = await validateConfigObject(input, { configDirectory: path.dirname(absoluteConfigPath) })
  return { ...result, configPath: absoluteConfigPath }
}

export function formatErrors(errors) {
  return errors.map((error) => `- ${error}`).join('\n')
}
