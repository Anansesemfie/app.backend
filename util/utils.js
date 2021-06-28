var nodemailer = require('nodemailer');
const myMail = {"mail":"mancuniamoe@gmail.com","password":"moeis1995"};
module.exports.mailer=(mail)=>{

   var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    // secureConnection: false, // TLS requires secureConnection to be false
    auth: {
      user: myMail.mail,
      pass: myMail.password
    },
    tls: {
      ciphers:'SSLv3'
  }
  });
  
  var mailOptions = {
    from: myMail.mail,
    to: mail.receiver,
    subject: mail.subject,
    text: mail.text,
    html:mail.html

  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  }); 

}


module.exports.service={
    "port":4000,
    "host":"http://127.0.0.1:4000/",
    "DB":"mongodb://localhost:27017/Ananse_fie",
    "secret":"symbiosis"
}

