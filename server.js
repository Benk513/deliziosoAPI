const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

dotenv.config({path:'./config.env'})

const port = process.env.PORT



// DEFINE THE SERVER
const app = express()


// ROUTES HANDLING

app.get('/', (req, res) => {
    res.send('Hello World!')
})


// LISTENING THE SERVER 
app.listen(port, () => {
    console.log("Server running successully !!")
})