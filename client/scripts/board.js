import display from "./display.js"
import Castle from "./castle/castle.js"

const maxAttempts = 500

export default class Board {
  constructor(options) {
    this.castles = []

    this.count = options.castleCount
    this.spread = options.castleSpread
    this.additionLimit = options.pathAdditionLimit
    this.maxPaths = options.maxCastlePaths

    this.generateCastles()
    this.generatePaths()

    display.createLayers(3)
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

        x = Math.random() * display.width
        y = Math.random() * display.height
        let closestCastle = this.surroundingCastles(x, y)[0]
        
        validated = 
          Math.within(display.width * 0.1, x, display.width * 0.9) &&
          Math.within(display.height * 0.1, y, display.height * 0.9) &&
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
}