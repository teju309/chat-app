const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLoactionMessage} = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('new websocket connection')
    socket.broadcast.emit('receiveMessage', generateMessage('A new user joined'))
    socket.emit('receiveMessage',generateMessage('Welcome!'))

    socket.on('sendMessage', (message , callback) => {
    const filter = new Filter()
    if(filter.isProfane(message)){
      return callback('Profanity is not allowed')
    }
      io.emit('receiveMessage',generateMessage(message))
      callback()
    })

    socket.on('disconnect',() => {
      io.emit('receiveMessage',generateMessage('A user has left'))
    })

    socket.on('sendLocation', (coords , callback) => {
      io.emit('receiveLocation', generateLoactionMessage('https://www.google.com/maps?q='+coords.latitude+','+coords.longitude))
      callback('location delivered!')
    })
})

server.listen(port, () => {
    console.log('port no.')
    console.log(port)
})