export function getScreenSize(realSize = true) {
  if (document.documentElement && realSize) {
    return (
      document.documentElement.clientWidth +
      'x' +
      document.documentElement.clientHeight
    )
  }
  return window.innerWidth + 'x' + window.innerHeight
}

export function generateCoordMap(mapId: string = 'vidar') {
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
    if (!(screenSize in window)) {
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

export function getScreenSizes(mapId = '_coordMap_vidar') {
  if (mapId && (window as any)[`_coordMap_${mapId}`]) {
    return Object.keys((window as any)[`_coordMap_${mapId}`])
  }
  return [getScreenSize(false)]
}

export function coordsToJson(mapId: string) {
  return JSON.stringify((window as any)[`_coordMap_${mapId}`])
}

export function loadCoordsMap(coordsMap: any, mapIds: string[]) {
  for (const [idx, mapId] of mapIds.entries()) {
    if (coordsMap[idx]) {
      ;(window as any)[`_coordMap_${mapId}`] = coordsMap[idx]
    }
  }
}

export function loadCoordMap(coordMap: any, mapId: string) {
  ;(window as any)[`_coordMap_${mapId}`] = coordMap
}

export function getCoordMap(mapId: string = 'vidar') {
  return (window as any)[`_coordMap_${mapId}`]
}
