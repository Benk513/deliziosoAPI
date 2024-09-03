const express = require('express')
const morgan = require('morgan')

const menuRouter = require('./routes/menuRoutes')

const app = express()

// MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())

app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
})



// ROUTES
app.get('/', (req, res) => {
    res.send("hey working here")
})
app.use('/api/v1/menu', menuRouter)

// app.all('*', (req, res, next) => {
//     res.status(404).json({
//         status: 'fail',
//         message: `Can't find ${req.originalUrl} on this server !`
//     })

    
//     next()
// })


app.all('*', (req, res, next) => {
     
    const err = new Error(`can't find ${req.originalUrl} path`)
    err.statusCode =404
    err.status ="fail"
    next(err)
})

app.use((err,req,res,next)=>{

    err.statusCode =err.statusCode || 500
    err.status = err.status || 'error'

    res.status(err.statusCode).json({
        status: err.status,
        message:err.message
    })

})


module.exports =app