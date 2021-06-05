import sampleData from './data.js'
import { getData } from '../../dist/data.js'
import { canvas2dRenderer } from '../../dist/renderer.js'

const rawData = getData(sampleData)
const heat = canvas2dRenderer('canvas')

function draw() {
  console.time('draw')
  heat.draw(null, sampleData)
  console.timeEnd('draw')
}

draw()

document.querySelector('canvas').onmousemove = function (e) {
  rawData.add([e.layerX, e.layerY, 1])
  window.requestAnimationFrame(draw)
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
