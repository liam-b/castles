const socketIO = require('socket.io')
const Board = require('./board.js')
const Player = require('./player.js')

module.exports = class GameServer {
  constructor(http) {
    this.io = socketIO(http)
    this.clients = []

    // this.io.emit('GameInitaliseEvent')

    setInterval(() => {
      console.log('emit', 'GameInitaliseEvent')
      
      this.io.emit('GameInitaliseEvent')

      setTimeout(() => {
        console.log('emit', 'GameStartEvent')
  
        this.reset()
        for (let client of this.clients) {
          let player = new Player(client.id, client.hue)
          this.board.players.push(player)
          this.board.castles[this.board.players.length - 1].owner = player
        }
  
        this.io.emit('GameStartEvent', this.board.serialise())
      }, 5000)

    }, 20000)

    // this.io.emit('GameStartEvent', this.board.serialise())

    // this.io.emit('SyncEvent', this.board.serialiseSync())

    // this.io.emit('GameEndEvent')

    this.io.on('connection', socket => {
      console.log('new connection', socket.id)

      socket.on('PlayerJoinRequest', client => {
        console.log('on', 'PlayerJoinRequest')
        
        let previouslyJoined = false
        for (const joinedClient of this.clients) {
          if (joinedClient.id == client.id) previouslyJoined = true
        }

        if (!previouslyJoined) this.clients.push(client)
        socket.emit('PlayerJoinAcknowledge', { accepted: !previouslyJoined })
      })

      socket.on('PlayerEvent', event => {
        console.log('on', 'PlayerEvent')

        console.log('emit', 'PlayerEvent')
        socket.broadcast.emit('PlayerEvent', event)
        this.board.deserialiseEvent(event)
      })

      socket.on('PlayerLeaveEvent', client => {
        for (const joinedClient of this.clients) {
          if (joinedClient.id == client.id) {
            this.clients.splice(this.clients.indexOf(joinedClient), 1)
          }
        }
      })
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
  }
}
