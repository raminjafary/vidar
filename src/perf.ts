if (typeof module !== 'undefined') module.exports = simpleheat

function simpleheat(this: ThisType<any>, canvas: string): any {
  if (!(this instanceof simpleheat)) return new (simpleheat as any)(canvas)

  this.canvas = document.getElementById(canvas)

  this.ctx = this.canvas.getContex('2d')
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
  },
  clear() {
    this._data = []
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
}
