if (typeof module !== 'undefined') module.exports = simpleheat

function simpleheat(this: ThisType<any>, canvas: string): any {
  if (!(this instanceof simpleheat)) return new (simpleheat as any)(canvas)

  this.canvas = canvas = document.getElementById(canvas)

  this.ctx = this.canvas.getContext('2d')
  this.width = canvas.width
  this.height = canvas.height

  this._max = 1
  this._data = []
}

simpleheat.prototype = {
  defaultRadius: 25,
  defaultGradient: {
    0.4: 'blue',
    0.6: 'cyan',
    0.7: 'lime',
    0.8: 'yellow',
    1.0: 'red',
  },
  data(data: any) {
    this._data = data
    return this
  },
  max(max: number) {
    this._max = max
    return this
  },
  add(data: any) {
    this._data.push(data)
    return this
  },
  clear() {
    this._data = []
    return this
  },
  resize() {
    this.width = this.canvas.width
    this.height = this.canvas.height
  },
  createCanvas() {
    if (typeof document != 'undefined') {
      return document.createElement('canvas')
    } else {
      return new this.canvas.constructor()
    }
  },
  radius(r: number, blur: number = 15) {
    const circle: HTMLCanvasElement = (this._circle = this.createCanvas())
    const ctx = circle.getContext('2d')
    const r2 = (this._r = r + blur)

    circle.width = circle.height = r2 * 2

    ctx!.shadowOffsetX = ctx!.shadowOffsetY = r2 * 2
    ctx!.shadowBlur = blur
    ctx!.shadowColor = 'black'

    ctx!.beginPath()
    ctx!.arc(-r2, -r2, r, 0, 2 * Math.PI, true)
    ctx!.closePath()
    ctx!.fill()

    return this
  },
  gradient(grad: any) {
    const canvas: HTMLCanvasElement = this.createCanvas(),
      ctx = canvas.getContext('2d'),
      gradient = ctx!.createLinearGradient(0, 0, 0, 256)

    canvas.width = 1
    canvas.height = 256

    for (const i in grad) {
      gradient.addColorStop(+i, grad[i])
    }

    ctx!.fillStyle = gradient
    ctx?.fillRect(0, 0, 1, 256)

    this._grad = ctx?.getImageData(0, 0, 1, 256).data

    return this
  },

  colorize(pixels: any, gradient: any) {
    for (let i = 0, len = pixels.length, j; i < len; i += 4) {
      j = pixels[i + 3] * 4

      if (j) {
        pixels[i] = gradient[j]
        pixels[i + 1] = gradient[j + 1]
        pixels[i + 2] = gradient[j + 2]
      }
    }
  },
  draw(minOpacity: number) {
    if (!this._circle) this.radius(this.defaultRadius)
    if (!this._grad) this.gradient(this.defaultGradient)

    const ctx = this.ctx

    ctx.clearRect(0, 0, this.width, this.height)

    for (let i = 0, p; i < this._data.length; i++) {
      p = this._data[i]
      ctx.globalAlpha = Math.min(
        Math.max(
          p[2] / this._max,
          minOpacity === undefined ? 0.05 : minOpacity
        ),
        1
      )
      ctx.drawImage(this._circle, p[0] - this._r, p[1] - this._r)
    }

    const data = ctx.getImageData(0, 0, this.width, this.height)
    this.colorize(data.data, this._grad)
    ctx.putImageData(data, 0, 0)

    return this
  },
}
