export default class Player {
  constructor(id, hue, opponent) {
    this.id = id
    this.hue = hue
    this.opponent = !!opponent
  }
}