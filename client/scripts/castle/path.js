import display from "../display.js"

export default class Path {
  constructor(castle, destination) {
    this.castle = castle
    this.destination = destination
    this.deployments = []
    this.index

    display.switchLayer(0)
    this.shape = display.line(castle.x, castle.y, (destination.x + castle.x) / 2, (destination.y + castle.y) / 2, "#eaeaeaaa", 20)
    this.angle = Math.atan2(castle.x - destination.x, castle.y - destination.y) + Math.PI
  }

  setHue(hue) {
    this.shape.set({ strokeColor: display.HSB(hue, 0.3, 0.98) })
  }
}