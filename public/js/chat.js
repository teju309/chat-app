const socket = io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML
 
socket.on('receiveMessage', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('receiveLocation', (message) => {
    console.log(message)
    const html = Mustache.render(locationTemplate,{
        url : message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage',message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error)
        {
            return console.log(error)
        }
        console.log('message delivered!')
    })
})

$sendLocation.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('geoloaction not supported by your browser')
    }

    $sendLocation.setAttribute('disabled', 'diasbled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },(message) => {
            $sendLocation.removeAttribute('disabled')
            return console.log(message)
        })
    })
})

