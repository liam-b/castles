import Game from "./game.js"
import Player from "./player.js";
import display from "./display.js";
import Board from "./board.js";

Math.distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

Math.within = (lower, value, upper) => {
  return value > lower && value < upper
}

display.createLayers(3)
var socket = io()
window.game = new Game(socket)

setInterval(() => { game.tick() }, 1000)
paper.view.onFrame = () => { game.update() }

// window.onbeforeunload = function () {
//   return "Do you really want to close?";
// };