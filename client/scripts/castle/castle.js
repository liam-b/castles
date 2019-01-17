import display from "../display.js"
import Path from "./path.js"
import Button from "./button.js"
import Deployment from "./deployment.js"

const CASTLE_SCALE = 1
const BUTTON_LENGTH = 30
const DEPLOY_LIMIT = 6

export default class Castle {
  constructor(x, y) {
    this.x = x
    this.y = y

    this.index
    this.connectedCastles = []

    this.shape = null
    this.backgroundShape = null
    this.paths = []
    this.buttons = []

    this.owner = null

    this.troops = 0
    this.capacity = 24
  }

  init() {
    display.switchLayer(1)
    this.backgroundShape = display.circle(this.x, this.y, 10, display.HSB(0, 0, 0.65))
    display.switchLayer(2)
    this.shape = display.circle(this.x, this.y, 2, display.HSB(0, 0, 0.5))
    this.updateTroops(5, this.owner)

    for (let i = 0; i < this.connectedCastles.length; i++) {
      let path = new Path(this, this.connectedCastles[i])
      let button = new Button(this, path)
      path.index = i
      this.paths.push(path)
      this.buttons.push(button)
    }
  }

  tick() {
    this.updateTroops(1, this.owner)
  }

  updateTroops(troops, owner) {
    if ((!owner && !this.owner) || (owner && this.owner && owner.id == this.owner.id)) {
      this.troops = Math.min(this.troops + troops, this.capacity)
    } else {
      this.troops = Math.max(0, this.troops - troops)
    }

    this.shape.scale((this.troops * CASTLE_SCALE + 2) / (this.shape.bounds.width / 2))
    for (let button of this.buttons) {
      button.x = button.path.castle.x + Math.sin(button.path.angle) * (this.troops * CASTLE_SCALE + BUTTON_LENGTH / 2)
      button.y = button.path.castle.y + Math.cos(button.path.angle) * (this.troops * CASTLE_SCALE + BUTTON_LENGTH / 2)

      button.shape.position = new paper.Point(button.x, button.y)
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
    if (player != null) {
      this.owner = player
      display.switchLayer(1)
      this.backgroundShape.set({ fillColor: display.HSB(this.owner.hue, 0.5, 0.98) })
      display.switchLayer(2)
      this.shape.set({ fillColor: display.HSB(this.owner.hue, 0.9, 0.98) })
  
      for (let path of this.paths) {
        path.setHue(this.owner.hue)
      }
  
      for (let button of this.buttons) {
        button.setHue(this.owner.hue)
      }
    }
  }

  deserialise(castle, castles, players) {
    this.index = castle.index
    this.connectedCastles = []
    for (let path of castle.paths) {      
      this.connectedCastles.push(castles[path.destination])
    }

    let owner = null
    for (let player of players) {
      if (player.id == castle.owner) {
        owner = player
        break
      }
    }

    this.init()
    this.setOwner(owner)
    this.troops = castle.troops
    this.updateTroops(0, this.owner)
  }

  deserialiseSync(castle, players) {
    let owner = null
    for (let player of players) {
      if (player.id == castle.owner) {
        owner = player
        break
      }
    }

    this.setOwner(owner)
    this.troops = castle.troops
    this.updateTroops(0, this.owner)
  }
}