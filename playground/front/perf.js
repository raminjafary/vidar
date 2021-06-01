import { getData } from '../../dist/data.js'
import { canvas2dRenderer } from '../../dist/renderer.js'

const rawData = getData(data)
const heat = canvas2dRenderer('canvas')

function draw() {
  console.time('draw')
  heat.draw(null, data)
  console.timeEnd('draw')
}

draw()

document.getElementById('canvas').onmousemove = function (e) {
  rawData.add([e.layerX, e.layerY, 1])
  window.requestAnimationFrame(draw)
}
