const nodemailer = require('nodemailer')


const sendEmail = async options =>{

    //1 Create a transporter (the service that sends email)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

    //2 Define the email options

    const mailOptions ={
        from :'Delizioso  <benkuyutech65@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message


    }
    //3 Actually send the email
    await transporter.sendMail(mailOptions)
}

module.exports =sendEmail