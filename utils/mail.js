const nodemailer =require('nodemailer')




exports.generateMailtranspoter =()=> nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: process.env.MAIL_TRAP_PORT,
        auth: {
          user: process.env.MAIL_TRAP_USER,
          pass: process.env.MAIL_TRAP_PASS
        }
  })



