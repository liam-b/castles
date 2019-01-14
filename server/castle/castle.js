const Path = require('./path.js')
const Button = require('./button.js')
const Deployment = require('./deployment.js')

const CASTLE_SCALE = 1
const BUTTON_LENGTH = 30
const DEPLOY_LIMIT = 4

module.exports = class Castle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.connectedCastles = []

    this.paths = []
    this.buttons = []

    this.owner = null

    this.troops = 0
    this.capacity = 25
  }

  init() {
    this.updateTroops(5, this.owner)

    for (const castle of this.connectedCastles) {
      let path = new Path(this, castle)
      let button = new Button(this, path)
      this.paths.push(path)
      this.buttons.push(button)
    }
  }

  tick() {
    this.updateTroops(1, this.owner)
  }

  updateTroops(troops, owner) {
    if (owner == this.owner) {
      this.troops = Math.min(this.troops + troops, this.capacity)
    } else {
      this.troops = Math.max(0, this.troops - troops)
    }

    for (let button of this.buttons) {
      button.x = button.path.castle.x + Math.sin(button.path.angle) * (this.troops * CASTLE_SCALE + BUTTON_LENGTH / 2)
      button.y = button.path.castle.y + Math.cos(button.path.angle) * (this.troops * CASTLE_SCALE + BUTTON_LENGTH / 2)
    }

    if (this.troops == 0 && owner != null) this.setOwner(owner)
  }

  deployTroops(path) {
    if (this.troops >= 1 && this.owner != null) {
      let deployAmount = Math.min(this.troops, DEPLOY_LIMIT)
      this.updateTroops(deployAmount, null)

      path.deployments.push(new Deployment(this, path, deployAmount))
    }
  }

  setOwner(player) {
    this.owner = player
  }
}