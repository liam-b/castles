const socketIO = require('socket.io')
const Board = require('./board.js')
const Player = require('./player.js')

module.exports = class GameServer {
  constructor(http) {
    this.io = socketIO(http)
    this.clients = []
    this.board

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

    setTimeout(() => { this.initaliseGame() }, 4000)
  }

  initaliseGame() {
    this.clients = []
    this.reset()

    console.log('emit', 'GameInitaliseEvent')
    this.io.emit('GameInitaliseEvent')

    setTimeout(() => { this.startGame() }, 2000)
  }

  startGame() {
    for (let client of this.clients) {
      let player = new Player(client.id, client.hue)
      this.board.players.push(player)
      this.board.castles[this.board.players.length - 1].owner = player
    }

    console.log('emit', 'GameStartEvent')
    this.io.emit('GameStartEvent', this.board.serialise())

    this.duringGame()
  }

  duringGame() {
    // console.log(this.board.castles)
    
    let ownerCastleCount = {}
    
    for (const castle of this.board.castles) {
      if (castle.owner) ownerCastleCount[castle.owner.id] = (ownerCastleCount[castle.owner.id] || 0) + 1
      else ownerCastleCount['null'] = (ownerCastleCount['null'] || 0) + 1
    }

    console.log('emit', 'SyncEvent')
    this.io.emit('SyncEvent', this.board.serialiseSync())

    if (Object.keys(ownerCastleCount).length == 1) setTimeout(() => { this.endGame() }, 3000)
    else setTimeout(() => { this.duringGame() }, 5000)
  }

  endGame() {
    console.log('emit', 'GameEndEvent')
    this.io.emit('GameEndEvent')

    setTimeout(() => { this.initaliseGame() }, 4000)
  }

  tick() {
    if (this.board) this.board.tick()
  }

  update(delta) {
    if (this.board) this.board.update(delta)
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
