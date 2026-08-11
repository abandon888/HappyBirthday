import { gsap } from 'gsap'
import { startFireworks } from './firework.js'

const SAFE_THEME_NAMES = new Set(['classic', 'warm', 'minimal'])
const textFields = new Set([
  'greeting',
  'name',
  'greetingText',
  'wishText',
  'text1',
  'textInChatBox',
  'sendButtonLabel',
  'text2',
  'text3',
  'text4',
  'text4Adjective',
  'text5Entry',
  'text5Content',
  'smiley',
  'bigTextPart1',
  'bigTextPart2',
  'wishHeading',
  'outroText',
  'replayText',
  'outroSmiley'
])

let audio = null
let isPlaying = false
let animation = null
let charactersPrepared = false

function isSafeResourceUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') return false

  try {
    const parsed = new URL(value, window.location.href)
    return parsed.protocol === 'https:' || parsed.origin === window.location.origin
  } catch {
    return false
  }
}

function setStatus(message) {
  const status = document.querySelector('[data-status]')
  if (status) status.textContent = message
}

function setText(nodeName, value) {
  const node = document.querySelector(`[data-node-name="${nodeName}"]`)
  if (!node) {
    console.warn(`HappyBirthday: missing node for ${nodeName}`)
    return
  }
  node.textContent = String(value)
}

function setImage(value) {
  const image = document.querySelector('[data-node-name="imagePath"]')
  if (!image || !isSafeResourceUrl(value)) {
    console.warn('HappyBirthday: ignored unsafe image URL')
    return
  }
  image.setAttribute('src', value)
}

function isBinaryFont(value) {
  try {
    const pathname = new URL(value, window.location.href).pathname.toLowerCase()
    return ['.ttf', '.otf', '.woff', '.woff2'].some((extension) => pathname.endsWith(extension))
  } catch {
    return false
  }
}

async function setFonts(fonts) {
  if (!Array.isArray(fonts)) return

  for (const font of fonts) {
    if (!font || typeof font.name !== 'string' || !isSafeResourceUrl(font.path)) {
      console.warn('HappyBirthday: ignored unsafe font configuration')
      continue
    }

    if (isBinaryFont(font.path)) {
      try {
        const face = new FontFace(font.name, `url(${JSON.stringify(font.path)})`)
        await face.load()
        document.fonts.add(face)
      } catch (error) {
        console.warn(`HappyBirthday: could not load font ${font.name}`, error)
        continue
      }
    } else {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = font.path
      document.head.appendChild(link)
    }

    document.body.style.fontFamily = font.name
  }
}

function setAudio(value) {
  if (!isSafeResourceUrl(value)) {
    console.warn('HappyBirthday: ignored unsafe audio URL')
    return
  }

  audio = new Audio(value)
  audio.preload = 'auto'
  audio.addEventListener('error', () => {
    isPlaying = false
    document.getElementById('playPauseButton')?.classList.remove('playing')
    setStatus('音乐无法加载，但生日动画仍可播放。')
  })
}

async function applyConfiguration(config) {
  const theme = SAFE_THEME_NAMES.has(config.theme) ? config.theme : 'classic'
  document.documentElement.dataset.theme = theme
  document.body.dataset.theme = theme

  Object.entries(config).forEach(([key, value]) => {
    if (textFields.has(key) && value !== '') setText(key, value)
  })

  if (config.imagePath) setImage(config.imagePath)
  if (config.music) setAudio(config.music)
  await setFonts(config.fonts)
}

function splitIntoSpans(element) {
  if (!element) return
  const fragment = document.createDocumentFragment()

  for (const character of element.textContent || '') {
    const span = document.createElement('span')
    span.textContent = character
    fragment.appendChild(span)
  }

  element.replaceChildren(fragment)
}

function prepareAnimationText() {
  if (charactersPrepared) return
  splitIntoSpans(document.querySelector('.hbd-chatbox'))
  splitIntoSpans(document.querySelector('.wish-hbd'))
  charactersPrepared = true
}

function animationTimeline() {
  prepareAnimationText()
  if (animation) {
    animation.restart()
    return
  }

  const ideaTextTrans = { opacity: 0, y: -20, rotationX: 5, skewX: '15deg' }
  const ideaTextTransLeave = { opacity: 0, y: 20, rotationY: 5, skewX: '-15deg' }
  const themeStyles = getComputedStyle(document.documentElement)
  const accentColor = themeStyles.getPropertyValue('--accent-color').trim()
  const ideaHighlight = themeStyles.getPropertyValue('--idea-highlight').trim()
  const wishColor = themeStyles.getPropertyValue('--wish-color').trim()

  animation = gsap.timeline()
    .to('.container', { duration: 0.1, autoAlpha: 1 })
    .from('.one', { duration: 0.7, opacity: 0, y: 10 })
    .from('.two', { duration: 0.4, opacity: 0, y: 10 })
    .to('.one', { duration: 0.7, opacity: 0, y: 10 }, '+=2.5')
    .to('.two', { duration: 0.7, opacity: 0, y: 10 }, '-=1')
    .from('.three', { duration: 0.7, opacity: 0, y: 10 })
    .to('.three', { duration: 0.7, opacity: 0, y: 10 }, '+=2')
    .from('.four', { duration: 0.7, scale: 0.2, opacity: 0 })
    .from('.fake-btn', { duration: 0.3, scale: 0.2, opacity: 0 })
    .to('.hbd-chatbox span', { duration: 0.5, visibility: 'visible', stagger: 0.05 })
    .to('.fake-btn', { duration: 0.1, backgroundColor: accentColor })
    .to('.four', { duration: 0.5, scale: 0.2, opacity: 0, y: -150 }, '+=0.7')
    .from('.idea-1', { duration: 0.7, ...ideaTextTrans })
    .to('.idea-1', { duration: 0.7, ...ideaTextTransLeave }, '+=1.5')
    .from('.idea-2', { duration: 0.7, ...ideaTextTrans })
    .to('.idea-2', { duration: 0.7, ...ideaTextTransLeave }, '+=1.5')
    .from('.idea-3', { duration: 0.7, ...ideaTextTrans })
    .to('.idea-3 strong', { duration: 0.5, scale: 1.2, x: 10, backgroundColor: ideaHighlight, color: '#fff' })
    .to('.idea-3', { duration: 0.7, ...ideaTextTransLeave }, '+=1.5')
    .from('.idea-4', { duration: 0.7, ...ideaTextTrans })
    .to('.idea-4', { duration: 0.7, ...ideaTextTransLeave }, '+=1.5')
    .from('.idea-5', { duration: 0.7, rotationX: 15, rotationZ: -10, skewY: '-5deg', y: 50, z: 10, opacity: 0 }, '+=0.5')
    .to('.idea-5 .smiley', { duration: 0.7, rotation: 90, x: 8 }, '+=0.4')
    .to('.idea-5', { duration: 0.7, scale: 0.2, opacity: 0 }, '+=2')
    .from('.idea-6 span', { duration: 0.8, scale: 3, opacity: 0, rotation: 15, ease: 'expo.out', stagger: 0.2 })
    .to('.idea-6 span', { duration: 0.8, scale: 3, opacity: 0, rotation: -15, ease: 'expo.out', stagger: 0.2 }, '+=1')
    .fromTo('.baloons img', { opacity: 0.9, y: 1400 }, { duration: 2.5, opacity: 1, y: -1000, stagger: 0.2 })
    .from('.lydia-dp', { duration: 0.5, scale: 3.5, opacity: 0, x: 25, y: -25, rotationZ: -45 }, '-=2')
    .from('.hat', { duration: 0.5, x: -100, y: 350, rotation: -180, opacity: 0 })
    .from('.wish-hbd span', { duration: 0.7, opacity: 0, y: -50, rotation: 150, skewX: '30deg', ease: 'elastic.out(1, 0.5)', stagger: 0.1 })
    .fromTo('.wish-hbd span', { scale: 1.4, rotationY: 150 }, { duration: 0.7, scale: 1, rotationY: 0, color: wishColor, ease: 'expo.out', stagger: 0.1 }, 'party')
    .from('.wish h5', { duration: 0.5, opacity: 0, y: 10, skewX: '-15deg' }, 'party')
    .to('.eight svg', { duration: 1.5, visibility: 'visible', opacity: 0, scale: 80, repeat: 3, repeatDelay: 1.4, stagger: 0.3 })
    .to('.six', { duration: 0.5, opacity: 0, y: 30, zIndex: -1 })
    .from('.nine p', { duration: 1, ...ideaTextTrans, stagger: 1.2 })
    .to('.last-smile', { duration: 0.5, rotation: 90 }, '+=1')
}

async function togglePlay(play) {
  if (!audio) return

  try {
    if (play) await audio.play()
    else audio.pause()
    isPlaying = play
    document.getElementById('playPauseButton')?.classList.toggle('playing', play)
  } catch {
    isPlaying = false
    document.getElementById('playPauseButton')?.classList.remove('playing')
    setStatus('浏览器阻止了音乐播放，请再次点击播放按钮。')
  }
}

function bindControls() {
  const startButton = document.getElementById('startButton')
  const playPauseButton = document.getElementById('playPauseButton')
  const replayButton = document.getElementById('replay')

  startButton?.addEventListener('click', () => {
    document.querySelector('.startSign').style.display = 'none'
    animationTimeline()
    void togglePlay(true)
  })

  playPauseButton?.addEventListener('click', () => void togglePlay(!isPlaying))
  replayButton?.addEventListener('click', animationTimeline)
}

async function initialize() {
  try {
    const response = await fetch('./customize.json', { cache: 'no-store' })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const config = await response.json()
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      throw new Error('customize.json must contain an object')
    }

    await applyConfiguration(config)
    bindControls()
    startFireworks()
  } catch (error) {
    console.error('HappyBirthday initialization failed:', error)
    setStatus('无法加载生日配置，请检查 customize.json。')
  }
}

void initialize()
