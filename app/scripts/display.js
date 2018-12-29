var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

export default {
  width: canvas.width,
  height: canvas.height,

  circle: (x, y, r, fill, stroke, strokeWidth) => {
    ctx.beginPath()
      ctx.arc(x, y, r, 0, 2 * Math.PI)
      
      ctx.fillStyle = fill
      ctx.fill()
  
      ctx.lineWidth = strokeWidth
      ctx.strokeStyle = stroke
      if (!!strokeWidth) ctx.stroke()
    ctx.closePath()
  },

  line: (x1, y1, x2, y2, stroke, strokeWidth) => {
    ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.lineWidth = strokeWidth
      ctx.strokeStyle = stroke
      ctx.stroke()
    ctx.closePath()
  },

  translate: (x, y) => {
    ctx.translate(x, y)
  },

  clear: () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}