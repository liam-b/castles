import Game from './game.js'
import display from './display.js'

Math.distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

Math.within = (lower, value, upper) => {
  return value > lower && value < upper
}

Math.randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

Math.uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

display.createLayers(3)
window.game = new Game()

setInterval(() => { game.tick() }, 1000)
// setInterval(() => { game.update() }, 17)
paper.view.onFrame = () => { game.update() }

// window.onbeforeunload = function () {
//   return "Do you really want to close?";
// };