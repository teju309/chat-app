const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const generateLoactionMessage = (url) => {
    return{
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLoactionMessage
}