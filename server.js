const dotenv = require('dotenv')
const mongoose = require('mongoose')

process.on('uncaughtException' , err=>{
  console.log(err.name , err.message)
  console.log('UNCAUGHT  REJECTION 🔥 shutting down...')
  process.exit(1) 
})

dotenv.config({ path: './config.env' })
const app = require('./app');

const port = process.env.PORT || 3000

// DATABASE CONNEXION
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'));

// LISTENING TO THE SERVER 
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}...`)
})    

process.on('unhandledRejection' , err=>{
  console.log(err.name , err.message)
  console.log('UNHANDLED REJECTION 🔥 shutting down...')
  server.close(()=> process.exit(1))

})
