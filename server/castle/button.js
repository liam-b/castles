const BUTTON_LENGTH = 30
const BUTTON_CLICK_SCALE = 1.25

module.exports = class Button {
  constructor(castle, path) {
    this.castle = castle
    this.path = path

    this.x = path.castle.x + Math.sin(path.angle) * BUTTON_LENGTH
    this.y = path.castle.y + Math.cos(path.angle) * BUTTON_LENGTH
  }

  mouseDown(event) {
    if (this.castle.owner != null) {
      this.castle.deployTroops(this.path)
    }
  }

  mouseUp(event) {
    if (this.castle.owner != null) {
    }
  }
}