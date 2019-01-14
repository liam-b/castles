const socketIO = require('socket.io')
const Player = require('./player.js')
const Board = require('./board.js')

module.exports = class GameServer {
  constructor(http) {
    this.io = socketIO(http)
    this.io.on('connection', (socket) => {
      socket.emit('acknowledge-connection', this.board.serialise())
    })

    this.players = []
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
