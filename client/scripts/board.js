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

  deserialise(board, client) {
    this.destroy()

    this.players = []
    for (let player of board.players) {
      this.players.push(new Player().deserialise(player, client))
    }

    this.castles = []
    for (let castle of board.castles) {
      this.castles.push(new Castle(castle.x, castle.y))
    }

    for (let i = 0; i < this.castles.length; i++) {
      this.castles[i].deserialise(board.castles[i], this.castles, this.players)
    }
  }

  deserialiseSync(sync) {
    for (let castle in sync.castles) {
      this.castles[castle.index].deserialise(castle, this.castles, this.players)
    }
  }

  deserialiseEvent(event) {
    switch (event.type) {
      case 'DeploymentEvent':
        this.castles[event.data.castle].deployTroops(this.castles[event.data.castle].paths[event.data.path])
        break
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

// this.castles = []
// this.players = []

// for (const castle of board.castles) {
//   this.castles.push(new Castle(castle.x, castle.y))
// }

// for (let castle of this.castles) {
//   let pathIndexes = []
//   for (const path of board.castles[this.castles.indexOf(castle)].paths) {
//     pathIndexes.push(path.destination)
//   }

//   for (const pathIndex of pathIndexes) {
//     castle.connectedCastles.push(this.castles[pathIndex])
//   }
// }

// for (const castle of this.castles) {
//   castle.init()
//   castle.setOwner(board.castles[this.castles.indexOf(castle)].owner)
//   castle.troops = board.castles[this.castles.indexOf(castle)].troops
//   castle.updateTroops(0, castle.owner)
// }

// for (const castle of this.castles) {
//   for (const path of castle.paths) {
//     for (const deployment of board.castles[this.castles.indexOf(castle)].paths[castle.paths.indexOf(path)].deployments) {
//       let dep = new Deployment(castle, path, deployment.troops)
//       dep.step = deployment.step
//       path.deployments.push(dep)
//     }
//   }
// }

// for (const player of board.players) {
//   this.players.push(new Player(player.id, player.hue, player.id != client.id))
// }