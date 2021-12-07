const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');


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


      if(process.env.NODE_ENV=="development"){
        process.env.DB="mongodb://localhost:27017/Ananse_fie";
      }
      console.log(process.env.DB);
      // else{
      //   
      // }
      

const service={
    "port":process.env.PORT || 5000,
    "host":process.env.HOST || "https://anansesemfie.com/",
    "DB":process.env.DB,
    "secret":process.env.SECRET
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
  console.log('mime is ',audioTypes.includes(mime))
  if(!audioTypes.includes(mime)){
    back=false
  }
  console.log('Size is ',size>1830718163)
  if(size>1830718163){
    back=false
  }
  // return imageTypes.includes(mime);
  return back
}


const audioStorage = multer.memoryStorage();

  const uploadAudio = multer({audioStorage,
    fileFilter:(req,file,cb)=>{
      console.log(file.mimetype,file.size)
    
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


    // const updateCover = async (file,path)=>{
    //   try{


    //   }
    //   catch(error){
    //     throw error;
    //   }
    // }






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


    const createAudioDIr = async (direct,file,title,oldDir='')=>{//new audio file
        try{
          let buff = new Buffer.from(file.buffer, 'base64');//to buffer from Base64
          let newTitle = title.split(' ');
          newTitle = newTitle.join('-');

          if(oldDir){//remove the old directory
            if(fs.existsSync(`uploads${oldDir.slice(1)}`)){//if dir exists
              fs.unlinkSync(`uploads${oldDir.slice(1)}`);
            }
            
          }
          console.log(newTitle,buff);
          let filename =`uploads/${direct}/${newTitle}${Audioextention(file.mimetype)}`
          if (fs.existsSync(filename)) {
            filename=`uploads/${direct}/${newTitle}-${Audioextention(file.mimetype)}`;
            // Do something
        }

          fs.writeFileSync(filename, buff);

          return {filename:filename.slice(7),mimetype:file.mimetype};



        }
        catch(err){
          throw err;
        }
    }

    const createImageDIr = async (direct,file,title,oldDir='')=>{//new audio file
      try{
        let buff = new Buffer.from(file.buffer, 'base64');//to buffer from Base64
        let newTitle = title.split(' ');
        newTitle = newTitle.join('-');

        if(oldDir){//remove the old directory
          if(fs.existsSync(`uploads${oldDir.slice(1)}`)){//if dir exists
            fs.unlinkSync(`uploads${oldDir.slice(1)}`);
          }
          
        }
        console.log(newTitle,buff);
        let filename =`uploads/${direct}/${newTitle}${Imgextention(file.mimetype)}`
        if (fs.existsSync(filename)) {
          filename=`uploads/${direct}/${newTitle}-${Imgextention(file.mimetype)}`;
          // Do something
      }

        fs.writeFileSync(filename, buff);

        return {filename:filename.slice(8),mimetype:file.mimetype};



      }
      catch(err){
        throw err;
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

    const milliToggle = (details)=>{
      let data;
      let time = parseInt(details.time);

      switch (details.return) {
        case 'toDays':
         data =(time)/(1000*60*60*24);
          
          break;
          case 'toMilliseconds':
            
          data = time * 24 * 60 * 60 * 1000;
          break;
      
        default:

          break;
      }

      return data;

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










module.exports={
  mailer,
  service,
  decode_JWT,
  uploadCover,
  uploadAudio,
  createFolderDIr,
  createAudioDIr,
  createImageDIr,
  realDate,
  updateUserDP,
  genRandCode,
  milliToggle
}
