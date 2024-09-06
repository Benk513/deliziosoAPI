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
    sendErrorProd(err, res);
   }
}