const { book,bookReact,bookComment} = require('../models/bookModel');
// const {user} = require('../models/userModel');
// const jwt = require('jsonwebtoken');
const {mailer,decode_JWT,service,cover} = require('../util/utils'); 
const fs = require('fs');
const { Buffer } = require('buffer');



const handleError= (error)=>{
    console.log(error.message,error.code);
let err = {
    title:'',
    description:'',
    user:''
}

if(error.message==="This book needs a title!"){
//title not available
err.title=error.message;
}

if(error.message==="This is a very long title"){
    //title too long
    err.title=error.message;
    
    }


    //description
if(error.message==="Say something to tease your audience"){
        //description missing
        err.description=error.message;
        
        }
if(error.message==="Express yourself much more than this"){
            //description not long enough
            err.description=error.message;
            
            }
if(error.message==="Do not narrate the whole thing here"){
                //description too long
                err.description=error.message;
                
                }

if(error.message==="Missing uploader"){
        //user
        err.user=error.message
        
        }
}




//Add book
const Up_book = async (req,res)=>{
  try{

      let body = req.body;//get body from request
      let file = req.file;//get file details from request after being handled by multer
      let authors = body.author.split('-');//split author strings into an array


        console.log(body,file);
    // book.create({})
        
  }
  catch(err){
   const errors = handleError(err);
   res.status(403).json(errors);
  }
  
  
   
    
    
}




// for chapters
'audio/mpeg','audio/wave','audio/mp4'
let ext = (file)=>{
  let mime;
if(file ==='audio/mpeg'){
  mime = '.mp3';
}
else if(file==='audio/wave'){
  mime ='.wav';
}
else{
  mime ='.mp4';
}
return mime;
}

const upFile = async (req,res)=>{
    let file = req.file;
  console.log(file);
  console.log(req.body);
    if(file){
      console.log(file.path)
      let buff = new Buffer.from(file.buffer, 'base64');
     
      
let chap = await fs.writeFileSync(`uploads/audio/${req.body.title}${ext(file.mimetype)}`, buff);

      return res.json({status:'OK',base64:chap})
    }
    else{
      res.status(404).json({status:'fileupload error'});
    }
}

module.exports={
    Up_book,
    upFile
}

