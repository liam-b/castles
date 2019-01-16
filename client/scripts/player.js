export default class Player {
  constructor(id, hue, opponent) {
    this.id = id || ''
    this.hue = hue || 0
    this.opponent = opponent || true
  }

  serialise() {
    return {
      id: this.id,
      hue: this.hue
    }
  }

  deserialise(player, client) {
    this.id = player.id
    this.hue = player.hue
    this.opponent = player.id != client.id
    return this
  }
}