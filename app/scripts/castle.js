import display from "./display.js"

export default class Castle {
  constructor(x, y, options) {
    this.x = x
    this.y = y

    this.paths = []
  }

  addPath(castle) {
    if (!(castle in this.paths)) this.paths.push(castle)
  }

  drawCastle() {
    display.circle(this.x, this.y, 20, "#aaaaaa")
  }

  drawPaths() {
    for (const castle of this.paths) {
      display.line(this.x, this.y, castle.x, castle.y, "#eaeaea", 20)
    }
  }

  drawButtons() {
    for (const castle of this.paths) {
      let dist = Math.pow(Math.distance(this.x, this.y, castle.x, castle.y), 1)
      let factor = dist / 50

      let midX = this.x + (castle.x - this.x) / factor
      let midY = this.y + (castle.y - this.y) / factor

      display.line(this.x, this.y, midX, midY, "#cfcfcf", 20)
    }
  }
}
