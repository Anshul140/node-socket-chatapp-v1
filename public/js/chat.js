const socket = io()

// Options
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})

//messages
//elements
const msgForm = document.getElementById('messageForm')
const msgFormInput = msgForm.querySelector('input')
const msgFormBtn = msgForm.querySelector('button')
const $messages = document.getElementById('messages')

//autoscroll
const autoscroll = () => {
    // new message element
    const $newMessage = $messages.lastElementChild

    //Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight

    console.log(newMessageMargin)

    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight

    //how far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
} 

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

msgForm.addEventListener('submit', (e) => {
     e.preventDefault()
     
     //disable
     msgFormBtn.setAttribute('disabled', 'disabled')

     const message = e.target.elements.msg.value

     socket.emit('sendMessage', message, (error) => {
        //enable
        msgFormBtn.removeAttribute('disabled') 
        msgFormInput.value = ''
        msgFormInput.focus()

        if(error){
            return console.log(error)
        }

        console.log('The message was delivered ')
     })
})

//Location
const sendLocn = document.getElementById('send-locn')
const $locationTemplate = document.getElementById('location-template').innerHTML

socket.on('locationMessage', (locnUrl) => {
    // console.log('Location-Link: ',url)   
    const html = Mustache.render($locationTemplate, {
        username: locnUrl.username,
        url: locnUrl.url,
        createdAt: moment(locnUrl.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

sendLocn.addEventListener('click', () => {

    sendLocn.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported in your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        // console.log(position.coords.latitude)
    
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude 
        }, (ack) => {
            sendLocn.removeAttribute('disabled')
            console.log(ack)
        })
    })
})

//side-bar -->
//template
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})