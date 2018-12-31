var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

// paper.install(window)
paper.setup(canvas)
paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight)

export default {
  width: window.innerWidth,
  height: window.innerHeight,

  Color: paper.Color,
  HSB: (h, s, b) => {
    return new paper.Color({ hue: h, saturation: s, brightness: b })
  },

  circle: (x, y, r, fill, stroke, strokeWidth) => {
    let circle = new paper.Path.Circle(new paper.Point(x, y), r)
    circle.fillColor = fill
    if (!!strokeWidth) circle.strokeColor = stroke
    if (!!strokeWidth) circle.strokeWidth = strokeWidth
    return circle
  },

  line: (x1, y1, x2, y2, stroke, strokeWidth) => {
    let line = new paper.Path.Line(new paper.Point(x1, y1), new paper.Point(x2, y2))
    if (!!strokeWidth) line.strokeColor = stroke
    if (!!strokeWidth) line.strokeWidth = strokeWidth
    return line
  },

  translate: (x, y) => {
    ctx.translate(x, y)
  },

  clear: () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  },

  createLayers: (num) => {
    for (let i = 0; i < num; i++) {
      new paper.Layer()
    }
  },

  switchLayer: (num) => {
    paper.project.layers[num].activate()
  }
}