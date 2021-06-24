import sampleData from './data.js'
import { Canvas2dRenderer, ensureAvailableFrames } from '../../dist/index.js'

const heatmap = new Canvas2dRenderer('canvas')
heatmap.data = sampleData

function draw() {
  console.time('draw')
  heatmap.draw()
  console.timeEnd('draw')
}

draw()

document.querySelector('canvas').onmousemove = function (e) {
  heatmap.addData([e.layerX, e.layerY, 1])
  const frame = ensureAvailableFrames(draw)
  frame.request()
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
