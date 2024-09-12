const express = require('express')
const morgan = require('morgan')
const AppError= require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const menuRouter = require('./routes/menuRoutes')
const userRouter = require('./routes/userRoutes')

// I create the express app
const app = express()

// MIDDLEWARES

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json()) 
app.use((req, res, next) => {

    if(process.env.NODE_ENV ==="production"){
        console.log('we in production now ')
      }else{
        console.log('we in development now ')
      }
    
    next();
})

// ROUTES
app.get('/', (req, res) => {
    res.send("Welcome to the Delizioso Restaurant API")
})
app.use('/api/v1/menu', menuRouter)
app.use('/api/v1/users', userRouter)

// app.all('*', (req, res, next) => {
//     res.status(404).json({
//         status: 'fail',
//         message: `Can't find ${req.originalUrl} on this server !`
//     })

    
//     next()
// })


app.all('*', (req, res, next) => {
     
    // const err = new Error(`can't find ${req.originalUrl} path`)
    // err.statusCode =404
    // err.status ="fail"
    // next(err)

    //call the instance of our errors 
    next(new AppError(`can't find ${req.originalUrl} on the server`,404));
})

// this middleware is a special middleware because it's catches all the errors , with the error parameter ,
// express can know that it is a special middleware 
// au cas ou il ya erreur on saute la chaine des next() et on atterit ici en final dou pas de next, sinon on continue sa course

app.use(globalErrorHandler)
module.exports =app
