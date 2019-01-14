import Game from "./game.js"
import Player from "./player.js";
import display from "./display.js";

var socket = io('http://localhost:8080/')
socket.on('acknowledge-connection', (data) => {
  console.log(socket.id);
})


Math.distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

Math.within = (lower, value, upper) => {
  return value > lower && value < upper
}

var game = new Game()
setInterval(() => { game.tick() }, 1000)
paper.view.onFrame = event => { game.update() }

let thing = new Player(200)


game.board.castles[0].setOwner(game.player)
game.board.castles[1].setOwner(thing)