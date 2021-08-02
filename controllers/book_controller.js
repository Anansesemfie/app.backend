const { book,bookReact,bookComment} = require('../models/bookModel');
const files = require('../models/files');

const {mailer,decode_JWT,service,createFileDIr} = require('../util/utils'); 
const fs = require('fs');
const { Buffer } = require('buffer');



const handleError= (error)=>{
    console.log(error.message,error.code);
let err = {
    title:'',
    description:'',
    user:'',
    file:''
}

if(error.message==="This book needs a title!"){
//title not available
err.title=error.message;
}

if(error._message==="This is a very long title"){
    //title too long
    err.title="Book title too long";
    
    }


    //description
if(error.message==="Say something to tease your audience"){
        //description missing
        err.description=error.message;
        
        }
if(error._message==="Express yourself much more than this"){
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
if(error.message ==="No file was uploaded"){
  error.file=error.message;
}

        return err;
}




//Add book
const New_book = async (req,res)=>{
  try{
      let newBook ={
        title:"",
        description:"",
        authors:[],
        category:[],
        cover:"",
        uploader:""
      }

      let body = req.body;//get body from request
      let file = req.file;//get file details from request after being handled by multer
     
      if(!file){
        throw 'No file was uploaded';
      }
      

      newBook.title=body.title;
      newBook.description=body.description;
      newBook.category=body.category
      newBook.uploader=await decode_JWT(req.cookies.jwt);
      newBook.authors = body.author.split('-');//split author strings into an array
      // newBook.cover = {originalname:file.originalname,encoding:file.encoding,mimetype:file.mimetype,buffer:file.buffer};

      // console.log(newBook.cover);

        let fileBack = await createFileDIr(file,body.title);
        console.log(fileBack);

      let response = await book.create({title:newBook.title,description:newBook.description,folder:fileBack.location,cover:fileBack.cover,authors:newBook.authors,category:newBook.category,uploader:newBook.uploader});
      
      if(!response){
     throw 'Could not create book';
      
      }
      res.redirect(`/book/${response._id}`);
        
        
  }
  catch(err){
    console.log(err);
   const errors = handleError(err);
   res.status(403).json(errors);
  }
}


//update book pages
const Update_book = async (req,res)=>{
  const action=req.params.action;
  const bookID = req.params.book;
  console.log(action,bookID);
  switch (action) {
    case "Edit":
       res.render(`book`);
      break;
    case "Read":
      res.render(`book`);
      break;
    default:
      res.redirect('/');
      break;
  }
  
}

const Get_book = async (req,res)=>{
  try{
     let bookID = req.params.book;//get book id from request
   let bookBack;
  let creator=false;
  
  if(req.cookies.jwt){//logged in user 
    bookBack= await book.findOne({_id:bookID});//get book from DB
    let user = await decode_JWT(req.cookies.jwt);
  

  if(bookBack.uploader==user._id){
    creator=true;
  }
  if(!creator){//if not the uploader kick out
    res.redirect('/');
  }
  }

  else{//not logged user koraa 
    bookBack = await book.findOne({_id:bookID,status:'Active'});//get book from DB
    if(!bookBack){
    res.redirect('/');
  }
  }
 
  res.json({bookBack,creator});
  }
  catch(err){
    let erros = handleError(err);
    res.send(erros);
  }
 


}

const Get_books =async (req,res)=>{
  try{
    let books;

     if(req.cookies.jwt){//if user is logged in
    books = await book.find({status:'Active'});
  }
  else{
    books = await book.find({status:'Active'});
    console.log('no user');
     //process file here 

    
  }

 res.json({books});
  }
  catch(err){
    console.log(err);

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
     
      // const dir = `uploads/${Date.now()}`
      fs.mkdir(dir);
let chap = await fs.writeFile(`${req.body.title}${ext(file.mimetype)}`, buff);

      return res.json({status:'OK',base64:chap})
    }
    else{
      res.status(404).json({status:'fileupload error'});
    }
}

module.exports={
    New_book,
    Update_book,
    upFile,
    Get_book,
    Get_books
}

