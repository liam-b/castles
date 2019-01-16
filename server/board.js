const Castle = require('./castle/castle.js')
const Deployment = require('./castle/deployment.js')
const Player = require('./player.js')

Math.distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

Math.within = (lower, value, upper) => {
  return value > lower && value < upper
}

const WIDTH = 1440
const HEIGHT = 800

const maxAttempts = 500

module.exports = class Board {
  constructor(options) {
    this.count = options.castleCount
    this.spread = options.castleSpread
    this.additionLimit = options.pathAdditionLimit
    this.maxPaths = options.maxCastlePaths

    this.players = []
    this.castles = []

    this.generateCastles()
    this.generatePaths()

    for (let castle of this.castles) {
      castle.init()
    }
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

  generateCastles() {
    let attempts = 0
    for (let i = 0; i < this.count; i++) {
      let x, y
      let validated = false
      while (!validated) {
        if (attempts > maxAttempts) break
        attempts++

        x = Math.random() * WIDTH
        y = Math.random() * HEIGHT
        let closestCastle = this.surroundingCastles(x, y)[0]
        
        validated = 
          Math.within(WIDTH * 0.1, x, WIDTH * 0.9) &&
          Math.within(HEIGHT * 0.1, y, HEIGHT * 0.9) &&
          (closestCastle == undefined || closestCastle.distance > this.spread)
      }

      if (attempts > maxAttempts) break
      let cast = new Castle(x, y)
      cast.index = i
      this.castles.push(cast)
    }
  }

  generatePaths() {
    for (let castle of this.castles) {
      let closestCastles = this.surroundingCastles(castle.x, castle.y)
      let count = 0
      
      for (let closest of closestCastles) {
        if (closest.distance < this.spread * 2 && castle.connectedCastles.length < this.maxPaths && closest.castle.connectedCastles.length < this.maxPaths) {
          if (castle.connectedCastles.indexOf(closest.castle) == -1 && closest.castle.connectedCastles.indexOf(castle) == -1) {
            castle.connectedCastles.push(closest.castle)
            closest.castle.connectedCastles.push(castle)

            if (count > this.pathAdditionLimit) break
            count++
          }
        }
      }
    }
  }

  surroundingCastles(x, y) {
    let list = []
    for (const castle of this.castles) {
      const dist = Math.distance(x, y, castle.x, castle.y)
      if (dist != 0) {
        list.push({
          castle: castle,
          distance: dist
        })
      }
    }

    return list.sort((a, b) => {
      if (a.distance > b.distance) return 1
      if (b.distance > a.distance) return -1
      return 0
    })
  }

  serialise() {
    let players = []
    for (let player of this.players) {
      players.push(player.serialise())
    }

    let castles = []
    for (let castle of this.castles) {
      castles.push(castle.serialise())
    }
    

    return {
      players: players,
      castles: castles
    }
  }

  serialiseSync() {
    let castles = []
    for (let castle of this.castles) {
      castles.push(castle.serialise())
    }

    return {
      castles: castles
    }
  }

  deserialiseEvent(event) {
    switch (event.type) {
      case 'DeploymentEvent':
        this.castles[event.data.castle].deployTroops(this.castles[event.data.castle].paths[event.data.path])
        break
    }
  }
}