module.exports = class Player {
  constructor(id, hue) {
    this.id = id
    this.hue = hue
  }

  serialise() {
    return {
      id: this.id,
      hue: this.hue
    }
  }
}