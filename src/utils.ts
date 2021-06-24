export function ensureAvailableFrames(fn: any) {
  let lastArgs: any = null
  let frameId: number | null = null

  function request(...args: any[]) {
    lastArgs = args

    if (frameId) return

    frameId = window.requestAnimationFrame(() => {
      frameId = null
      fn(...lastArgs)
    })
  }

  function cancel() {
    if (!frameId) return

    cancelAnimationFrame(frameId)
    frameId = null
  }

  return {
    cancel,
    request,
  }
}
