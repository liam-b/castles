module.exports = class Path {
  constructor(castle, destination) {
    this.castle = castle
    this.destination = destination
    this.deployments = []
    this.angle = Math.atan2(castle.x - destination.x, castle.y - destination.y) + Math.PI
  }
}