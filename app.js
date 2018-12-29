const express = require('express')
const path = require('path')
var app = express()

app.set('views', path.join(__dirname, 'app/views'))
app.use(express.static('app'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/app/views/index.html'))
})

const port = process.env.PORT || 8080
app.listen(port, function () {
  console.log('listen', `listening on port ${port}`)
})