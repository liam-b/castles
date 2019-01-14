import Board from "./board.js"
import Player from "./player.js"

export default class Game {
  constructor() {
    this.player = new Player(randomInt(0, 360))
    this.board = new Board({
      castleCount: 25,
      castleSpread: 150,
      pathAdditionLimit: 2,
      maxCastlePaths: 4
    })
  }

  tick() {
    this.board.tick()
  }

  update() {
    this.board.update()
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}