import display from "../display.js"

const DEPLOYMENT_SCALE = 1.4
const STEP_SIZE = 0.7

export default class Deployment {
  constructor(castle, path, troops) {
    this.castle = castle
    this.path = path
    this.troops = troops
    this.step = 0

    this.x = this.castle.x
    this.y = this.castle.y

    display.switchLayer(1)
    let drawSize = this.troops * DEPLOYMENT_SCALE + 2
    this.shape = display.circle(this.x, this.y, drawSize, display.HSB(this.castle.owner.hue, 0.82, 0.98))
    this.shape.locked = true
  }

  update() {
    this.step += STEP_SIZE
    this.x = this.castle.x + Math.sin(this.path.angle) * this.step
    this.y = this.castle.y + Math.cos(this.path.angle) * this.step
    this.shape.position = new paper.Point(this.x, this.y)

    if (Math.distance(this.x, this.y, this.path.destination.x, this.path.destination.y) < this.path.destination.shape.bounds.width / 2) this.hitCastle(this.path.destination)

    for (let path of this.path.destination.paths) {
      if (path.destination == this.castle) {
        for (let deployment of path.deployments) {
          if (deployment.castle.owner != this.castle.owner && Math.distance(this.x, this.y, deployment.x, deployment.y) < deployment.path.destination.shape.bounds.width / 4) this.hitDeployment(deployment)
        }
      }
    }
  }

  hitCastle(castle) {
    castle.updateTroops(this.troops, this.castle.owner)
    this.remove()
  }

  hitDeployment(deployment) {
    if (this.troops > deployment.troops) {
      this.setTroops(this.troops - deployment.troops)
      deployment.remove()
    } else if (this.troops < deployment.troops) {
      deployment.setTroops(deployment.troops - this.troops)
      this.remove()
    } else {
      deployment.remove()
      this.remove()
    }
  }

  remove() {
    this.path.deployments.splice(this.path.deployments.indexOf(this), 1)
    this.shape.remove()
  }

  setTroops(troops) {
    this.troops = troops
    this.shape.scale((this.troops * DEPLOYMENT_SCALE + 2) / (this.shape.bounds.width / 2))
  }
}