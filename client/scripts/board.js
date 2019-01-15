import display from "./display.js"
import Castle from "./castle/castle.js"
import Player from "./player.js";
import Deployment from "./castle/deployment.js";

export default class Board {
  constructor() {
    this.castles = []
    this.players = []
  }

  update() {
    for (let castle of this.castles) {
      for (let path of castle.paths) {
        for (let deployment of path.deployments) {
          deployment.update()
        }
      }
    }
  }

  tick() {
    for (let castle of this.castles) {
      if (castle.owner != null) castle.tick()
    }
  }

  serialise() {
    let players = []
    for (const player of this.players) {
      players.push({
        id: player.id,
        hue: player.hue
      })
    }

    let castles = []
    for (const castle of this.castles) {
      let paths = []
      for (const path of castle.paths) {
        let deployments = []
        for (const deployment of path.deployments) {
          deployments.push({
            path: castle.paths.indexOf(deployment.path),
            troops: deployment.troops,
            step: deployment.step
          })
        }

        paths.push({
          destination: this.castles.indexOf(path.destination),
          angle: path.angle,

          deployments: deployments
        })
      }

      let owner = null
      if (castle.owner) {
        for (const player of players) {
          if (player.id == castle.owner.id) {
            owner = player
            break
          }
        }
      }

      castles.push({
        x: castle.x,
        y: castle.y,
        owner: owner,

        troops: castle.troops,
        capacity: castle.capacity,

        paths: paths
      })
    }

    

    let data = {
      castleCount: this.count,
      castleSpread: this.spread,
      pathAdditionLimit: this.additionLimit,
      maxCastlePaths: this.maxPaths,

      players: players,
      castles: castles
    }

    return data
  }

  deserialise(data, play) {
    this.castles = []
    this.players = []

    for (const castle of data.castles) {
      this.castles.push(new Castle(castle.x, castle.y))
    }

    for (let castle of this.castles) {
      let pathIndexes = []
      for (const path of data.castles[this.castles.indexOf(castle)].paths) {
        pathIndexes.push(path.destination)
      }

      for (const pathIndex of pathIndexes) {
        castle.connectedCastles.push(this.castles[pathIndex])
      }
    }

    for (const castle of this.castles) {
      castle.init()
      castle.setOwner(data.castles[this.castles.indexOf(castle)].owner)
      castle.troops = data.castles[this.castles.indexOf(castle)].troops
      castle.updateTroops(0, castle.owner)
    }

    for (const castle of this.castles) {
      for (const path of castle.paths) {
        for (const deployment of data.castles[this.castles.indexOf(castle)].paths[castle.paths.indexOf(path)].deployments) {
          let dep = new Deployment(castle, path, deployment.troops)
          dep.step = deployment.step
          path.deployments.push(dep)
        }
      }
    }

    for (const player of data.players) {
      this.players.push(new Player(player.id, player.hue, player.id != play.id))
    }
  }

  destroy() {
    if (this.castles.length > 0) {
      for (let castle of this.castles) {
        castle.shape.remove()
        castle.backgroundShape.remove()

        for (let path of castle.paths) {
          path.shape.remove()

          for (let deployment of path.deployments) {
            deployment.shape.remove()
          }
        }

        for (let button of castle.buttons) {
          button.shape.remove()
        }
      }
    }
  }
}