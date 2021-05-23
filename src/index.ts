interface ICoordMap {
  [key: string]: number[][]
}
interface IDimensions {
  width?: number
  height?: number
  maxWidth?: number
  maxHeight?: number
}
interface IPoint {
  x: number
  y: number
}

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

function getScreenSizes(mapId = 'vidar') {
  if (mapId && (window as any)[`_coordMap_${mapId}`]) {
    return Object.keys((window as any)[`_coordMap_${mapId}`])
  }
  return [getScreenSize(false)]
}

function coordsToJson(mapId: string) {
  if ((window as any)[`_coordMap_${mapId}`]) {
    return JSON.stringify((window as any)[`_coordMap_${mapId}`])
  }
  return ''
}

function loadCoordMaps(coordsMap: ICoordMap[], mapIds: string[]) {
  for (const [idx, mapId] of mapIds.entries()) {
    if (coordsMap[idx]) {
      ;(window as any)[`_coordMap_${mapId}`] = coordsMap[idx]
    }
  }
}

function loadCoordMap(coordMap: ICoordMap, mapId: string) {
  ;(window as any)[`_coordMap_${mapId}`] = coordMap
}

function getCoordMap(mapId: string = 'vidar') {
  return (window as any)[`_coordMap_${mapId}`]
}

function getHeatMap(
  el?: string,
  dimensions?: IDimensions,
  mapIds: string[] = ['vidar'],
  screenSize?: string
) {
  let id = `_coordMap_${mapIds[0]}`

  if (!(id in window)) {
    return
  }

  if (!screenSize) {
    screenSize = getScreenSize(false)
  }

  let coordMap = (window as any)[id]

  if (!coordMap[screenSize]) return false

  const [sw, sh] = getScreenSize(false)
    .split('x')
    .map((x) => +x)

  const canvas = document.createElement('canvas')

  if (dimensions && (dimensions.maxWidth || dimensions.maxHeight)) {
    const sr = sw / sh
    const srr = sh / sw

    if (!dimensions.maxWidth) {
      dimensions.maxWidth = 0
    }

    if (dimensions.maxHeight) {
      dimensions.maxHeight = 0
    }
    dimensions.width = dimensions.maxWidth
    const smallestDimension =
      dimensions.maxWidth > dimensions.maxHeight!
        ? dimensions.maxHeight
        : dimensions.maxWidth

    if (sr === 1) {
      dimensions.width = smallestDimension
      dimensions.height = smallestDimension
    } else if (sr > 1 && dimensions.maxWidth) {
      dimensions.width = dimensions.maxWidth
      dimensions.height = dimensions.maxWidth * srr
    } else if (dimensions.maxHeight) {
      dimensions.height = dimensions.maxHeight
      dimensions.width = dimensions.maxHeight * sr
    } else {
      dimensions.width = dimensions.maxWidth
      dimensions.height = dimensions.maxWidth * srr
    }
  }

  canvas.width = dimensions?.width ? dimensions.width : sw
  canvas.height = dimensions?.height ? dimensions.height : sh

  const context = canvas.getContext('2d')
  let wr = 0,
    hr = 0

  if (dimensions) {
    wr = dimensions.width! / sw
    hr = dimensions.height! / sh
  }

  context?.clearRect(0, 0, canvas.width, canvas.height)

  const totalCoords = coordMap[screenSize].length

  context!.filter = 'blur(5px)'
  const alpha = 0.1 / mapIds.length

  for (const [_index, mapId] of mapIds.entries()) {
    id = `_coordMap_${mapId}`
    coordMap = (window as any)[id]

    for (let i = 0; i < totalCoords; i++) {
      let [x, y] = coordMap[screenSize][i]
      if (dimensions) {
        x = x * wr
        y = y * hr
      }
      context!.fillStyle = `rgba(0,0,0, ${alpha})`
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

    const colorOffset = Math.floor(alpha * 255)

    pixels![idx - 3] = gradientPixel![colorOffset * 4]
    pixels![idx - 2] = gradientPixel![colorOffset * 4 + 1]
    pixels![idx - 1] = gradientPixel![colorOffset * 4 + 2]
  }

  context?.putImageData(imageData!, 0, 0)

  const output = canvas?.toDataURL('image/png')
  document.querySelector(el!)!.innerHTML = `<img src=${output} />`
  return output
}
