var nodemailer = require('nodemailer');
const myMail = {"mail":"mancuniamoe@gmail.com","password":"moeis1995"};
module.exports.mailer=(mail)=>{

   var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: myMail.mail,
      pass: myMail.password
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
    "host":"",
    "DB":"mongodb://localhost:27017/Ananse_fie",
    "secret":"symbiosis"
}

