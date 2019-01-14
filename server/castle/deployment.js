const DEPLOYMENT_SCALE = 1.4
const STEP_SIZE = 0.7

module.exports = class Deployment {
  constructor(castle, path, troops) {
    this.castle = castle
    this.path = path
    this.owner = castle.owner
    this.troops = troops
    this.step = 0

    this.x = this.castle.x
    this.y = this.castle.y
  }

  update() {
    this.step += STEP_SIZE
    this.x = this.castle.x + Math.sin(this.path.angle) * this.step
    this.y = this.castle.y + Math.cos(this.path.angle) * this.step

    if (Math.distance(this.x, this.y, this.path.destination.x, this.path.destination.y) < 2) this.hitCastle(this.path.destination)

    for (let path of this.path.destination.paths) {
      if (path.destination == this.castle) {
        for (let deployment of path.deployments) {
          if (Math.distance(this.x, this.y, deployment.x, deployment.y) < 1) this.hitDeployment(deployment)
        }
      }
    }
  }

  hitCastle(castle) {
    castle.updateTroops(this.troops, this.owner)
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
  }

  setTroops(troops) {
    this.troops = troops
  }
}