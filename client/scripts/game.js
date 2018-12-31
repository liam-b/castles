import Board from "./board";
import Player from "./player";

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
}

function randomInt(min, max) {
  Math.floor(Math.random() * (max - min + 1)) + min
}