const express = require('express')
const morgan = require('morgan')
const AppError= require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const rateLimit = require('express-rate-limit')
const helmet =require('helmet')
const mongoSanitize =require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')
//importing routes
const menuRouter = require('./routes/menuRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const reservationRouter = require('./routes/reservationRoutes')
//parse cookies into req
const cookieParser =require('cookie-parser')
//const cartRouter = require('./routes/cartRoutes')
const path = require('path');

// I create the express app
const app = express()

//GLOBAL MIDDLEWARES

// app.use(cors({
//     origin: '*',
// origin: 'http://localhost:5173',

const corsOptions = {
    origin: 'http://localhost:5173',  // Allow only your frontend origin
    credentials: true                 // Allow credentials (cookies, headers, etc.)
  };
  
app.use(cors(corsOptions));

//set security http headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}))
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5000, // limit each IP to 100 requests per windowMs
    message:'Too many request from this IP, please try again in an hour!'

})
app.use('/api',limiter); 

//limit the payload to 16kb
app.use(express.json({limit:'16kb'})) 

app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(cookieParser())



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');  // Add this header
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
  
  //Data sanitization against NoSQL auery injection
//remove all the injection through the body and params
app.use(mongoSanitize())

//Data sanitization against xss
app.use(xss())

//help prevent to add two times sort
app.use(hpp({
  // here put fields to be whitelisted (repeated as many times as possible)
  whitelist: ['price', 'limit', 'page']
}))

//define a static folder to serve files from public folder


// Serve static files from the "public" directory
app.use('/images', cors(corsOptions), express.static(path.join(__dirname, 'public/images')));


app.use((req, res, next) => {

    if(process.env.NODE_ENV ==="production"){
        console.log('we in production now ')
      }else{
        console.log('we in development now ')
      }
    
    next();
})

app.use((req,res,next)=>{
    console.log(req.method, req.url)
    console.log(req.headers)
    
    next()
  })
  
// ROUTES
app.get('/', (req, res) => {
    res.send("Welcome to the Delizioso Restaurant API")
})
app.use('/api/v1/menu', menuRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/reservations',reservationRouter)
//pp.use('/api/v1/cart', cartRouter)


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
