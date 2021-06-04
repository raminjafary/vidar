export function getData(points: number[][]) {
  let data = points || []

  return {
    add(points: number[]) {
      data.push(points)
    },
    clear() {
      data = []
    },
    get points() {
      return data
    },
  }
}
