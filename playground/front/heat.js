import sampleData from './data.js'
import { Canvas2dRenderer } from '../../dist/renderer.js'

const heatmap = new Canvas2dRenderer('canvas')
heatmap.data = sampleData

let frame = null

function draw() {
  console.time('draw')
  heatmap.draw()
  console.timeEnd('draw')
  frame = null
}

draw()

document.querySelector('canvas').onmousemove = function (e) {
  heatmap.addData([e.layerX, e.layerY, 1])
  frame = frame || window.requestAnimationFrame(draw)
}

document.addEventListener('visibilitychange', function send() {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('http://localhost:4000', JSON.stringify(sampleData))
  }
})

document.querySelector('button').onclick = function render() {
  const parent = document.querySelector('.render')
  if (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
  html2canvas(document.body).then((canvas) => {
    parent.appendChild(canvas)
  })
}
