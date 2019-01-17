const express = require('express')
const path = require('path')
var app = express()
var http = require('http').Server(app)
const GameServer = require('./server/main.js')

app.set('views', path.join(__dirname, 'client/views'))
app.use(express.static('client'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/views/index.html'))
})

const port = process.env.PORT || 8080
http.listen(port, function () {
  console.log('listen', `listening on port ${port}`)
})

var game = new GameServer(http)
setInterval(() => { game.tick() }, 1000)

// setInterval(() => { game.reset() }, 300000)

let lastTime = microtime()
function gameLoop() {
  let currentTime = microtime()
  let delta = (currentTime - lastTime) / 1000000 * 60
  lastTime = currentTime
  
  game.update(delta)
}
setInterval(gameLoop, 17)

function microtime() {
  let hrTime = process.hrtime()
  return hrTime[0] * 1000000.0 + hrTime[1] / 1000.0
}