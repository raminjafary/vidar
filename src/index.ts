function getScreenSize(realSize = true) {
  if (document.documentElement && realSize) {
    return (
      document.documentElement.clientWidth +
      'x' +
      document.documentElement.clientHeight
    )
  }
  return window.innerWidth + 'x' + window.innerHeight
}

function generateCoordMap(mapId: string = 'vidar') {
  let screenSize = getScreenSize()
  let hoverTime = 0,
    hoverTimer = 0
  const id = `_coordMap_${mapId}`
  if (id in window) {
    return false
  }
  ;(window as any)[id] = {}
  const coordMap = (window as any)[id]
  window.addEventListener('resize', () => {
    screenSize = getScreenSize(false)
  })

  window.addEventListener('mousemove', (e) => {
    clearInterval(hoverTimer)
    if (!(screenSize in coordMap)) {
      coordMap[screenSize] = []
    }
    const x = e.clientX + window.scrollX,
      y = e.clientY + window.scrollY
    coordMap[screenSize].push([x, y])
    hoverTimer = window.setInterval(() => {
      coordMap[screenSize].push([x, y])
      hoverTime++
      if (hoverTime > 5) {
        clearInterval(hoverTimer)
      }
    }, 1000)
  })
}

function getScreenSizes(mapId = '_coordMap_vidar') {
  if (mapId && (window as any)[`_coordMap_${mapId}`]) {
    return Object.keys((window as any)[`_coordMap_${mapId}`])
  }
  return [getScreenSize(false)]
}

function coordsToJson(mapId: string) {
  return JSON.stringify((window as any)[`_coordMap_${mapId}`])
}

function loadCoordsMap(coordsMap: any, mapIds: string[]) {
  for (const [idx, mapId] of mapIds.entries()) {
    if (coordsMap[idx]) {
      ;(window as any)[`_coordMap_${mapId}`] = coordsMap[idx]
    }
  }
}

function loadCoordMap(coordMap: any, mapId: string) {
  ;(window as any)[`_coordMap_${mapId}`] = coordMap
}

function getCoordMap(mapId: string = 'vidar') {
  return (window as any)[`_coordMap_${mapId}`]
}

function getHeatMap(el: string, mapIds: string[] = ['vidar']) {
  const screenSize = getScreenSize(false)
  let id = `_coordMap_${mapIds[0]}`

  if (!(id in window)) {
    return
  }

  let coordMap = (window as any)[id]

  if (!coordMap[screenSize]) return false

  const [sw, sh] = getScreenSize(false)
    .split('x')
    .map((x) => +x)

  const canvas = document.createElement('canvas')
  canvas.width = sw
  canvas.height = sh

  const context = canvas.getContext('2d')
  context?.clearRect(0, 0, canvas.width, canvas.height)

  const totalCoords = coordMap[screenSize].length

  context!.filter = 'blur(5px)'
  const alpha = 0.1 / mapIds.length

  for (const [index, mapId] of mapIds.entries()) {
    id = `_coordMap_${mapId}`
    coordMap = (window as any)[id]

    for (let i = 0; i < totalCoords; i++) {
      const [x, y] = coordMap[screenSize][i]
      context!.fillStyle = `rgb(0,0,0, ${alpha})`
      context?.beginPath()
      context?.arc(x, y, 10, 0, 2 * Math.PI)
      context?.fill()
    }
  }

  const gradientCanvas = document.createElement('canvas')
  gradientCanvas.width = 1
  gradientCanvas.height = 256

  const ctx = gradientCanvas.getContext('2d')

  const colors = {
    0.4: 'blue',
    0.5: 'cyan',
    0.6: 'lime',
    0.8: 'yellow',
    1.0: 'red',
  }

  const gradient = ctx!.createLinearGradient(0, 0, 0, 256)
  for (const color in colors) {
    gradient?.addColorStop(Number(color), (colors as any)[color])
  }

  ctx!.fillStyle = gradient
  ctx?.fillRect(0, 0, 1, 256)

  const gradientPixel = ctx?.getImageData(0, 0, 1, 256).data
  const imageData = context?.getImageData(0, 0, canvas.width, canvas.height)
  const pixels = imageData!.data
  let len = pixels!.length / 4

  while (len--) {
    const idx = len * 4 + 3
    const alpha = pixels![idx] / 256

    const colorOfset = Math.floor(alpha * 255)

    pixels![idx - 3] = gradientPixel![colorOfset * 4]
    pixels![idx - 2] = gradientPixel![colorOfset * 4 + 1]
    pixels![idx - 1] = gradientPixel![colorOfset * 4 + 2]
  }

  context?.putImageData(imageData!, 0, 0)

  const output = canvas?.toDataURL('image/png')
  document.querySelector(el)!.innerHTML = `<img src=${output} />`
  return output
}
