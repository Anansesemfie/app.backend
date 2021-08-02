const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');

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

//JSON web Token 
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



//multer upload cover base64
const isImage = (mime,size)=>{
  let imageTypes = ['image/jpeg','image/png','images/gif'];
let back = true
  if(!imageTypes.includes(mime)){
    back=false
  }
  if(size>10718163){
    back=false
  }
  // return imageTypes.includes(mime);
  return back
}
//storage
const imgStorage = multer.memoryStorage()
// diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,'uploads');
//   },
//   filename:(req,file,cb)=>{
//     const id = Date.now()+file.originalname;
//     const filePath = `cover/${id}`;
  
//        cb(null,filePath);
     
//   }
// });

const uploadCover = multer({imgStorage,
fileFilter:(req,file,cb)=>{

  cb(null,isImage(file.mimetype,file.size));

}
});


 

//multer upload audio files
const isAudio = (mime,size)=>{
  let audioTypes = ['audio/mpeg','audio/wave','audio/mp4'];
let back = true
  if(!audioTypes.includes(mime)){
    back=false
  }
  if(size>30718163){
    back=false
  }
  // return imageTypes.includes(mime);
  return back
}


const audioStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'uploads');
    },
    filename:(req,file,cb)=>{
      const id = Date.now()+file.originalname;
      const filePath = `audio/${id}`;
    
         cb(null,filePath);
       
    }
  });

  const uploadAudio = multer({audioStorage,
    fileFilter:(req,file,cb)=>{
    
      cb(null,isAudio(file.mimetype,file.size));
    
    }
    });

    const Imgextention = (file)=>{
      let mime;
    if(file ==='image/jpeg'){
      mime = '.jpg';
    }
    else if(file==='image/png'){
      mime ='.png';
    }
    else{
      mime ='.gif';
    }
    return mime;
    }
    


    const createFileDIr = async (file,title)=>{
      try{
      let buff = new Buffer.from(file.buffer, 'base64');
      let newTitle = title.split(' ');
       newTitle = newTitle.join('-');
       console.log(newTitle);
     
      const dir = `uploads/${Date.now()}-${newTitle}`;

      if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
      
      let filename =`${dir}/${newTitle}${Imgextention(file.mimetype)}`

      fs.writeFileSync(filename, buff);
      
      return {location:dir.slice(7),cover:filename.slice(7)};
      }
      catch(err){
        console.log(err);
      }
      

    }





module.exports={
  mailer,
  service,
  decode_JWT,
  uploadCover,
  uploadAudio,
  createFileDIr
}
