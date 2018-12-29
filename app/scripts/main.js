import Board from "./board.js";

Math.distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

Math.within = (lower, value, upper) => {
  return value > lower && value < upper
}

var board = new Board({
  castleCount: 20,
  castleSpread: 180,
  pathAdditionLimit: 2,
  maxCastlePaths: 5
})

board.draw()