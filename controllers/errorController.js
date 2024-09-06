const AppError = require('./../utils/appError')

const handleCastErrorDB = err => {
    const message= `Invalid ${err.path} : ${err.value}`
    // 400 -> bad request
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0] 
    const message = `Duplicate field value : ${value}. Please use another value!` 
    return new AppError(message,400)
}



const sendErrorDev =(err,res) =>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        error:err,
        stack:err.stack
    })
   }
   
   const sendErrorProd =(err,res)=>{       
    // Operational error , trusted error: send message to client
    if(err.isOperational){
         res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    }) 
}
// un trusted error , programming error : don't leak details to client errors
    else{
        //1) Log error
        console.error('ERROR 🔥',err)

        //2) Send generic message 
        res.status(500).json({
            status:'error',
            message:'something went very wrong !!'
        })
    }  
   }

module.exports= (err,req,res,next) =>{
   err.statusCode =err.statusCode || 500
   err.status = err.status || 'error'

   if(process.env.NODE_ENV==='development'){
    sendErrorDev(err,res)
   }
   else if(process.env.NODE_ENV ==='production'){
    let error={...err}

    if(error.name ==="CastError") error = handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicateFieldsDB(error);
    if(error.name ==='ValidationError') error = handleValidationErrorDB(error)
    sendErrorProd(error, res);
   }
} 