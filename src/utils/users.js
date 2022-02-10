const users = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room) {
        return {
            error: 'Username and Room are required'
        }
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser){
        return {
            error: 'Username in use! Try Differnt UserName'
        }
    }

    // Store User
    const user = {id, username, room}
    users.push(user)

    return { user }
}

//removeUser
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

//getUser
const getUser = (id) => {
    return users.find((user) => user.id === id)

    // const index = users.findIndex((user) => user.id === id)

    // if(index !== -1){
    //     return users[index]
    // }
    // return undefined
}

//getuserInRoom
const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
    /*
    let arr = []
    for (const i in users) {
        // console.log(users[i])
        if(users[i].room === room)
           arr.push(users[i])
    }
    return arr
    */
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}