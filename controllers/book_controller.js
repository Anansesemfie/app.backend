const { book,bookReact,bookComment} = require('../models/bookModel');
// const {user} = require('../models/userModel');
// const jwt = require('jsonwebtoken');
const {mailer,decode_JWT,service,cover} = require('../util/utils'); 



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
  let body = req.body;
  let file = req.file;
  if(file){
    res.json({status:'Active',file:file,body});
    //
  }
  else{
res.status(403).json({status:'file not uploaded'});
  }
  
   
    
    
}

// const upFile = async (req,res)=>{
//     let file = req.file;
//   console.log(file);
//   console.log(req.body);
//     if(file){
//       console.log(file.path)
//       return res.json({status:'OK'})
//     }
//     else{
//       res.status(404).json({status:'fileupload error'});
//     }
// }

module.exports={
    Up_book,
    upFile
}

