const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const https = require('https');

// const { isNull } = require('util');

const myMail = {"mail":"anansesem.fie@thepostghana.com","password":"nanaasabere1992#"};

const mailer=(mail)=>{
  let status;
   var transporter = nodemailer.createTransport({
    host: 'mail.thepostghana.com',
    port: 465,
    secure: true,
    // secureConnection: false, // TLS requires secureConnection to be false
    auth: {
      user: myMail.mail,
      pass: myMail.password
    },
    tls: {
      ciphers:'SSLv3', 
      rejectUnauthorized: false,
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
      status= false;
    } else {
      console.log('Email info: ' +info.response );
      status=true;
      // return {Email_info:,Email_sent:true};
    }
  }); 

  return status;

}

process.env.DB="mongodb+srv://webUser:Falcon@6013@ananse-fie.xqmwg.mongodb.net/Ananse-fie?retryWrites=true&w=majority";
      if(process.env.NODE_ENV=="development"){
        process.env.DB="mongodb://localhost:27017/Ananse_fie";
      }
      // else{
      //   
      // }
      

const service={
    "port":process.env.PORT || 5000,
    "host":"https://anansesemfie.com/",
    "DB":process.env.DB,
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
    


    const createFolderDIr = async (file,title)=>{
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
        throw err;
      }
      

    }

    const updateUserDP = async (file,title)=>{
      try{
      let buff = new Buffer.from(file.buffer, 'base64');
      // let newTitle = title.split(' ');
      //  newTitle = newTitle.join('-');
      //  console.log(newTitle);
     
      const dir = `public/images/profile_display/`;

      if(fs.existsSync(`${dir}${title}.${Imgextention(file.mimetype)}`)){
        fs.rmdirSync(`${dir}${title}.${Imgextention(file.mimetype)}`);
    }
      
      let filename =`${dir}/${title}${Imgextention(file.mimetype)}`

      fs.writeFileSync(filename, buff);
      
      return {location:dir.slice(6),cover:filename.slice(6)};
      }
      catch(err){
        throw err;
      }
      

    }






    let Audioextention = (file)=>{
      let mime;
    if(file ==='audio/mpeg'){
      mime = '.mp3';
    }
    else if(file==='audio/wave'){
      mime ='.wav';
    }
    else if(file==='audio/mp4'){
      mime ='.mp4';
    }
    else{
      throw 'This is not a valid file';
    }
    return mime;
    }


    const createAudioDIr = async (direct,file,title)=>{
        try{
          let buff = new Buffer.from(file.buffer, 'base64');//to buffer from Base64
          let newTitle = title.split(' ');
          newTitle = newTitle.join('-');

          let filename =`uploads/${direct}/${newTitle}${Audioextention(file.mimetype)}`
          if (fs.existsSync(filename)) {
            filename+=`uploads/${direct}/${newTitle}-${Audioextention(file.mimetype)}`;
            // Do something
        }

          fs.writeFileSync(filename, buff);

          return {filename:filename.slice(7),mimetype:file.mimetype};



        }
        catch(err){
          res.json({Error:err});
        }
    }

    const realDate= (date)=>{//luxon to get meaningful time
      try{
        
        if(date==''||date==undefined||date==null){
          throw 'Invalid Date';
        }
      
      }
      catch(error){
        throw error;
      }
    }


    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$#%*&';
const genRandCode= ()=>{
    let result = ""
    let charactersLength = characters.length;
    for ( var i = 0; i < 16 ; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result
}



//paystack

const paystackOptions = {//paystack account info 
  hostname: 'api.paystack.co',
  port: 443,
  path: '/transaction/initialize',
  method: 'POST',
  headers: {
    Authorization: 'sk_test_c87e018dbb9c018a24afe295b8206c223bb2a13f',
    'Content-Type': 'application/json'
  }
}

const paystackReq = https.request(paystackOptions, res => {
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  });
  res.on('end', () => {
    return JSON.parse(data);
  })
}).on('error', error => {
  console.log(error);
})


const paywithPAYSTACK =async (params)=>{
  try{
    params.currency="USD";
    params.callback_URL =`${service.host}/`;

    const jstParams=JSON.stringify(params)
    
    const paymentStat = await paystackReq.write(jstParams);
    if(!paymentStat){
      throw 'Something';
    }
    console.log('status:',paymentStat);
    // return paymentStat;
    // paystackReq.end()
    
  }
  catch(error){
    throw error;
  }
}









module.exports={
  mailer,
  service,
  decode_JWT,
  uploadCover,
  uploadAudio,
  createFolderDIr,
  createAudioDIr,
  realDate,
  updateUserDP,
  genRandCode,
  paywithPAYSTACK
}
