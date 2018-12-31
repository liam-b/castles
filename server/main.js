const socketIO = require('socket.io')
const Player = require('./player.js')

module.exports = class GameServer {
  constructor(http) {
    this.io = socketIO(http)
    this.players = []

    this.io.on('connection', (socket) => {
      this.players.push(new Player(socket.id))
      console.log('player with id', socket.id, 'connected')
    
      socket.on('disconnect', () => {
        console.log('player with id', socket.id, 'disconnected')
        for (let player of this.players) {
          if (player.id == socket.id) this.players.splice(this.players.indexOf(player))
        }
      })
    })
  }
}
