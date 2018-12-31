import Board from "./board.js"
import Player from "./player.js"
import Game from "./game.js";

var socket = io('http://localhost:8080/')
// socket.on('connect', {})

Math.distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

Math.within = (lower, value, upper) => {
  return value > lower && value < upper
}

// var game = new Game()

var player = new Player(200)
var opponent = new Player(0)

var board = new Board({
  castleCount: 25,
  castleSpread: 150,
  pathAdditionLimit: 2,
  maxCastlePaths: 4
})

board.castles[0].setOwner(player)
board.castles[1].setOwner(opponent)

setInterval(() => { board.tick() }, 1000)
paper.view.onFrame = event => { board.update() }

