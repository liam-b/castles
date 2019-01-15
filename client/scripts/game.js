import Board from "./board.js"
import Player from "./player.js"

export default class Game {
  constructor(socket) {
    this.socket = socket

    this.player = new Player(0, randomInt(0, 360), false)
    this.board = new Board()

    this.socket.on('update', (data) => {  
      this.receivedUpdate(data)
    })

    this.socket.on('init', () => {
      this.board.players.push(this.player)

      for (const castle of this.board.castles) {
        if (castle.owner == null) {
          castle.setOwner(this.player)
          break
        }
      }

      this.sendUpdate()
    })

    this.socket.on('disconnect', () => {
      this.socket.reconnect()
    })
  }

  receivedUpdate(data) {
    this.player.id = this.socket.id
    if (this.board) this.board.destroy()
    this.board.deserialise(data.board, this.player)
  }

  sendUpdate() {
    this.socket.emit('update', {
      board: this.board.serialise()
    })
  }

  tick() {
    if (this.board) this.board.tick()
  }

  update() {
    if (this.board) this.board.update()
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}