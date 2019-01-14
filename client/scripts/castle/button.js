import display from "../display.js"
import Game from "../game.js";

const BUTTON_LENGTH = 30
const BUTTON_CLICK_SCALE = 1.25

export default class Button {
  constructor(castle, path) {
    this.castle = castle
    this.path = path

    this.x = path.castle.x + Math.sin(path.angle) * BUTTON_LENGTH
    this.y = path.castle.y + Math.cos(path.angle) * BUTTON_LENGTH
    display.switchLayer(1)
    this.shape = display.line(path.castle.x, path.castle.y, this.x, this.y, display.HSB(0, 0, 0.65), 20)

    this.shape.onMouseMove = (event) => { if (this.castle.owner != null) event.target.set({ strokeColor: display.HSB(0, 0, 0.7) }) }
    this.shape.onMouseLeave = (event) => { if (this.castle.owner != null) event.target.set({ strokeColor: display.HSB(0, 0, 0.65) }) }

    this.shape.onMouseDown = (event) => { this.mouseDown(event) }
    this.shape.onMouseUp = (event) => { this.mouseUp(event) }
  }

  setHue(hue) {
    this.shape.set({ strokeColor: display.HSB(hue, 0.5, 1) })
    this.shape.onMouseMove = (event) => { if (this.castle.owner != null) event.target.set({ strokeColor: display.HSB(hue, 0.43, 0.98) }) }
    this.shape.onMouseLeave = (event) => { if (this.castle.owner != null) event.target.set({ strokeColor: display.HSB(hue, 0.5, 0.98) }) }
  }

  mouseDown(event) {
    if (this.castle.owner != null) {
      this.shape.scale(BUTTON_CLICK_SCALE)
      this.castle.deployTroops(this.path)
      game.sendUpdate()
    }
  }

  mouseUp(event) {
    if (this.castle.owner != null) {
      this.shape.scale(1 / BUTTON_CLICK_SCALE)
      game.sendUpdate()
    }
  }
}