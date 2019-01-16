import Board from './board.js'
import Player from './player.js'

export default class Game {
  constructor() {
    this.socket = io()
    this.board = new Board()
    this.client = new Player(Math.uuid(), Math.randomInt(0, 360), false)
    this.participating = false

    this.socket.on('GameInitaliseEvent', () => {
      console.log('on', 'GameInitaliseEvent')

      console.log('emit', 'PlayerJoinRequest')
      
      this.socket.emit('PlayerJoinRequest', game.client.serialise())
    })
    
    this.socket.on('PlayerJoinAcknowledge', status => {
      console.log('on', 'PlayerJoinAcknowledge')

      this.participating = status.accepted
    })
    
    this.socket.on('GameStartEvent', board => {
      console.log('on', 'GameStartEvent')

      this.board.deserialise(board, this.client)
    })
    
    this.socket.on('PlayerEvent', event => {
      console.log('on', 'PlayerEvent')

      this.board.deserialiseEvent(event)
    })
    
    this.socket.on('SyncEvent', sync => {
      this.board.deserialiseSync(sync)
    })
    
    // this.socket.on('disconnect', () => {
    //   this.socket.connect()
    // })
  }

  sendEvent(event) {
    console.log('emit', 'PlayerEvent')

    if (this.participating) this.socket.emit('PlayerEvent', event)
  }

  tick() {
    if (this.board) this.board.tick()
  }

  update() {
    if (this.board) this.board.update()
  }
}

// function gameLoop() {
//   window.requestAnimationFrame(gameLoop);

//   currentTime = (new Date()).getTime();
//   delta = (currentTime - lastTime) / 1000;