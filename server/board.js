const Castle = require('./castle/castle.js')

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

    this.castles = []

    this.generateCastles()
    this.generatePaths()

    for (const castle of this.castles) {
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
      this.castles.push(new Castle(x, y))
    }
  }

  generatePaths() {
    for (let castle of this.castles) {
      let closestCastles = this.surroundingCastles(castle.x, castle.y)
      let count = 0
      
      for (let closest of closestCastles) {
        if (closest.distance < this.spread * 2 && castle.adjacentCastles.length < this.maxPaths && closest.castle.adjacentCastles.length < this.maxPaths) {
          if (castle.adjacentCastles.indexOf(closest.castle) == -1 && closest.castle.adjacentCastles.indexOf(castle) == -1) {
            castle.adjacentCastles.push(closest.castle)
            closest.castle.adjacentCastles.push(castle)

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

      castles.push({
        x: castle.x,
        y: castle.y,
        // owner: castle.owner.id,

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

      castles: castles
    }

    return data
  }
}