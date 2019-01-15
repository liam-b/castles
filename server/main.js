const socketIO = require('socket.io')
const Board = require('./board.js')

module.exports = class GameServer {
  constructor(http) {
    this.io = socketIO(http)

    this.io.on('connection', (socket) => {
      console.log('connected new player', socket.id)
      
      socket.emit('update', {
        board: this.board.serialise()
      })
      socket.emit('init')

      socket.on('update', (data) => {
        this.board.deserialise(data.board)
        socket.broadcast.emit('update', data)
      })
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

  reset() {
    this.board = new Board({
      castleCount: 25,
      castleSpread: 150,
      pathAdditionLimit: 2,
      maxCastlePaths: 4
    })

    for (let sock of Object.keys(this.io.sockets.sockets)) {
      this.io.sockets.sockets[sock].disconnect(true)
    }
  }
}
