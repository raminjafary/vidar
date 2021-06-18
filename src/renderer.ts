import config from './config.js'
export class Canvas2dRenderer {
  static instance: Canvas2dRenderer
  private width!: number
  private height!: number
  private max!: number
  private context!: CanvasRenderingContext2D
  private circle!: HTMLCanvasElement
  private radius!: number
  private gradient!: Uint8ClampedArray
  private minOpacity!: number
  private points: number[][] = [[]]

  constructor(private canvas: HTMLCanvasElement) {
    if (Canvas2dRenderer.instance) {
      return Canvas2dRenderer.instance
    }

    this.canvas = this.createCanvas(canvas)
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.max = 18

    Canvas2dRenderer.instance = this
    return this
  }

  get data() {
    return this.points
  }

  set data(points: number[][]) {
    this.points = points
  }

  addData(points: number[]) {
    this.points.push(points)
  }

  clearData() {
    this.data = []
  }

  resizeCanvas() {
    this.width = this.canvas.width
    this.height = this.canvas.height
  }
  createCanvas(canvas: HTMLCanvasElement | string = '') {
    if (!canvas) {
      return document.createElement('canvas')
    } else if (canvas && typeof canvas === 'string') {
      return document.querySelector(canvas) as HTMLCanvasElement
    } else {
      return canvas as HTMLCanvasElement
    }
  }
  setRadius(rad: number, blur: number = 15) {
    this.circle = this.createCanvas()
    const context = this.circle.getContext('2d') as CanvasRenderingContext2D
    this.radius = rad + blur

    this.circle.width = this.circle.height = this.radius * 2

    context.filter = 'blur(5px)'
    context.fillStyle = `rgba(0,0,0, ${1})`
    context.beginPath()
    context.arc(this.radius, this.radius, rad, 0, 2 * Math.PI, true)
    context.closePath()
    context.fill()

    return this
  }
  setGradient(grad: any) {
    const canvas = this.createCanvas()
    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    const gradient = context.createLinearGradient(0, 0, 0, 256)

    canvas.width = 1
    canvas.height = 256

    for (const color in grad) {
      gradient.addColorStop(+color, grad[color])
    }
    context.fillStyle = gradient
    context.fillRect(0, 0, 1, 256)

    this.gradient = context.getImageData(0, 0, 1, 256).data

    return this
  }
  colorize(pixels: Uint8ClampedArray, gradient: any) {
    for (let pixel = 0; pixel < pixels.length; pixel += 4) {
      const offset = pixels[pixel + 3] * 4

      if (offset) {
        pixels[pixel] = gradient[offset]
        pixels[pixel + 1] = gradient[offset + 1]
        pixels[pixel + 2] = gradient[offset + 2]
      }
    }
  }
  draw() {
    if (!this.circle) {
      this.setRadius(config.defaultRadius, config.defaultBlur)
    }

    if (!this.gradient) {
      this.setGradient(config.defaultGradient)
    }

    this.context?.clearRect(0, 0, this.width, this.height)

    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i]

      this.context.globalAlpha = Math.min(
        Math.max(p[2] / this.max, !this.minOpacity ? 0.05 : this.minOpacity),
        1
      )

      this.context?.drawImage(
        this.circle,
        p[0] - this.radius,
        p[1] - this.radius
      )
    }

    const pixels = this.context.getImageData(0, 0, this.width, this.height)
    this.colorize(pixels.data, this.gradient)
    this.context?.putImageData(pixels, 0, 0)
  }
  toDataUrl(mimeType = 'image/png') {
    return this.canvas.toDataURL(mimeType)
  }
}
