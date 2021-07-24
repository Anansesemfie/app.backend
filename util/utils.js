const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const myMail = {"mail":"mancuniamoe@gmail.com","password":"moeis1995"};

const mailer=(mail)=>{

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


const service={
    "port":4000,
    "host":"http://127.0.0.1:4000/",
    "DB":"mongodb://localhost:27017/Ananse_fie",
    "secret":"symbiosis"
}

const decode_JWT=async (code)=>{

  const token = code;
  //check token
  if(token){
      let back = {_id:""};

      try{
          jwt.verify(token,service.secret,(err,decodedToken)=>{
          if(err){
              throw err;
          }
          else{
             
              back._id=decodedToken.id;
          }
          });

          return back;
      }
      catch(err){
          throw err;
      }

      }
      
      
 
}



//multer upload cover
const isImage = (mime)=>{
  let imageTypes = ['image/jpeg','image/png','images/gif'];
  return imageTypes.includes(mime);
}
//storage
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'uploads');
  },
  filename:(req,file,cb)=>{
    const id = Date.now()+file.originalname;
    const filePath = `cover/${id}`;
  
       cb(null,filePath);
     
  }
});

const uploadCover = multer({storage,
fileFilter:(req,file,cb)=>{

  cb(null,isImage(file.mimetype));

}
});


  module.exports = uploadCover;
 







module.exports={
  mailer,
  service,
  decode_JWT,
  uploadCover
}
