module.exports = class Path {
  constructor(castle, destination) {
    this.castle = castle
    this.destination = destination
    this.index
    this.deployments = []
    this.angle = Math.atan2(castle.x - destination.x, castle.y - destination.y) + Math.PI
    
    console.log(this.castle.index, this.destination.index)
    
  }

  serialise() {
    return {
      source: this.castle.index,
      destination: this.destination.index,
      index: this.index
    }
  }
}