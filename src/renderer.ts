import config from './config.js'

type CanvasOrClass = string | HTMLCanvasElement
type Dict<T> = { [key: string]: T }

export function canvas2dRenderer(this: any, canvas: HTMLCanvasElement) {
  if (!(this instanceof canvas2dRenderer))
    return new (canvas2dRenderer as any)(canvas)

  const canvasFactory = {
    string: (el: string) => document.querySelector(el) as HTMLCanvasElement,
    object: (el: HTMLCanvasElement) => el,
    _: () => document.createElement('canvas') as HTMLCanvasElement,
  } as Dict<(el?: CanvasOrClass) => HTMLCanvasElement>

  canvas = !canvas ? canvasFactory['_']() : canvasFactory[typeof canvas](canvas)
  const context = canvas.getContext('2d')
  let width = canvas.width
  let height = canvas.height
  const max = 18

  return {
    resize() {
      width = canvas.width
      height = canvas.height
    },
    createCanvas() {
      if (typeof document != 'undefined') {
        return document.createElement('canvas')
      }
      // return new canvas.constructor()
    },
    setRadius(rad: number, blur: number = 15) {
      const circle = this.createCanvas()
      const context = circle!.getContext('2d')
      const r = rad + blur

      circle!.width = circle!.height = r * 2
      // context!.shadowOffsetX = context!.shadowOffsetY = r * 2
      // context!.shadowBlur = blur
      // context!.shadowColor = 'black'

      context!.filter = 'blur(5px)'
      context!.fillStyle = `rgba(0,0,0, ${1})`
      context!.beginPath()
      // ctx!.arc(-r2, -r2, r, 0, 2 * Math.PI, true)
      context!.arc(r, r, rad, 0, 2 * Math.PI, true)
      context!.closePath()
      context!.fill()

      return {
        r,
        circle,
      }
    },
    setGradient(grad: any) {
      const canvas = this.createCanvas()
      const context = canvas!.getContext('2d')

      const gradient = context!.createLinearGradient(0, 0, 0, 256)

      canvas!.width = 1
      canvas!.height = 256

      for (const color in grad) {
        gradient!.addColorStop(+color, grad[color])
      }
      context!.fillStyle = gradient
      context!.fillRect(0, 0, 1, 256)

      const data = context?.getImageData(0, 0, 1, 256).data

      return data
    },
    colorize(pixels: any, gradient: any) {
      for (let pixel = 0; pixel < pixels.length; pixel += 4) {
        const offset = pixels[pixel + 3] * 4

        if (offset) {
          pixels[pixel] = gradient[offset]
          pixels[pixel + 1] = gradient[offset + 1]
          pixels[pixel + 2] = gradient[offset + 2]
        }
      }
    },
    draw(minOpacity: number, data: []) {
      const grad = this.setGradient(config.defaultGradient)
      const { circle, r } = this.setRadius(
        config.defaultRadius,
        config.defaultBlur
      )

      context?.clearRect(0, 0, width, height)

      for (let i = 0; i < data.length; i++) {
        const p = data[i]

        context!.globalAlpha = Math.min(
          Math.max(p[2] / max, !minOpacity ? 0.05 : minOpacity),
          1
        )

        context?.drawImage(circle!, p[0] - r, p[1] - r)
      }

      const pixels = context!.getImageData(0, 0, width, height)
      this.colorize(pixels.data, grad)
      context?.putImageData(pixels, 0, 0)
    },
  }
}
