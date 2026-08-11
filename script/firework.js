let started = false

export function startFireworks() {
  if (started) return
  started = true

  const canvas = document.getElementById('fireworksCanvas')
  const context = canvas?.getContext('2d')
  if (!canvas || !context) return

  const fireworks = []

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  class Particle {
    constructor(x, y, color, angle, speed) {
      this.x = x
      this.y = y
      this.color = color
      this.angle = angle
      this.speed = speed
      this.size = Math.random() * 2 + 1
      this.alpha = 1
    }

    update() {
      this.x += Math.cos(this.angle) * this.speed
      this.y += Math.sin(this.angle) * this.speed
      this.speed = this.speed * 0.98 - 0.02
      this.alpha -= 0.015
    }

    draw() {
      context.globalAlpha = this.alpha
      context.fillStyle = this.color
      context.beginPath()
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      context.fill()
      context.globalAlpha = 1
    }
  }

  class Firework {
    constructor(x, y) {
      const colors = ['#ff5733', '#ffbd33', '#33ff57', '#3357ff', '#f033ff']
      this.particles = Array.from({ length: 30 }, () => {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 3 + 2
        const color = colors[Math.floor(Math.random() * colors.length)]
        return new Particle(x, y, color, angle, speed)
      })
    }

    update() {
      this.particles.forEach((particle) => particle.update())
      this.particles = this.particles.filter((particle) => particle.alpha > 0)
    }

    draw() {
      this.particles.forEach((particle) => particle.draw())
    }
  }

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    fireworks.forEach((firework) => {
      firework.update()
      firework.draw()
    })
    for (let index = fireworks.length - 1; index >= 0; index -= 1) {
      if (fireworks[index].particles.length === 0) fireworks.splice(index, 1)
    }
    window.requestAnimationFrame(animate)
  }

  window.addEventListener('resize', resizeCanvas)
  document.addEventListener('click', (event) => {
    const rectangle = canvas.getBoundingClientRect()
    fireworks.push(new Firework(event.clientX - rectangle.left, event.clientY - rectangle.top))
  })

  resizeCanvas()
  animate()
}
