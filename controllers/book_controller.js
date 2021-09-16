const { book} = require('../models/bookModel');
const User = require('../models/userModel');
const{ bookReact} = require('../models/reactionModel');

const {mailer,decode_JWT,service,createFolderDIr} = require('../util/utils'); 
const exempt = '-__v -status -folder -uploader';



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

        let fileBack = await createFolderDIr(file,body.title);
        console.log(fileBack);

      let response = await book.create({title:newBook.title,description:newBook.description,folder:fileBack.location,cover:fileBack.cover,authors:newBook.authors,category:newBook.category,uploader:newBook.uploader});
      
      if(!response){
     throw 'Could not create book';
      
      }
      res.redirect(`/book/Read/${response._id}`);
        
        
  }
  catch(err){
    console.log(err);
   const errors = handleError(err);
   res.render('instruction');
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
    bookBack= await book.findOne({_id:bookID},exempt);//get book from DB
    let user = await decode_JWT(req.cookies.jwt);
  

  if(bookBack.uploader==user._id){
    creator=true;
  }
  if(!creator&&bookBack.status=="Pending"){//if not the uploader kick out
    res.redirect('/');
  }
  }

  else{//not logged user koraa 
    bookBack = await book.findOne({_id:bookID,status:'Active'},exempt);//get book from DB
    if(!bookBack){
    res.redirect('/');
  }
  }
 
  res.json({bookBack,creator});
  }
  catch(err){
    let erros = handleError(err);
    res.render(erros);
  }
 


}

const Get_books =async (req,res)=>{
  try{
    let books;

     if(req.cookies.jwt){//if user is logged in
    books = await book.find({status:'Active'},exempt);
  }
  else{
    books = await book.find({status:'Active'},exempt);
    console.log('no user');
     //process file here 

    
  }

 res.json({books});
  }
  catch(err){
    console.log(err);

  }
 
}

const Get_mine= async (req,res)=>{
  try{
    let {user}=req.body;
    const Books ={
      liked:[],
      created:[]
    }
    if(!user){//get user 
      user=(await decode_JWT(req.cookies.jwt))._id;
      if(!user){
        throw 'User is Invalid';
      }
    }
    const me = await User.findOne({_id:user});
    if(me){
        const liked = await bookReact.find({user:me._id});//search for all liked books

        if(liked.length>0){//push liked books
          let i=1;
          liked.forEach(async bk=>{
            let _book= await book.findOne({_id:bk.bookID},exempt);//get book by ID
            console.log(i,_book);
            if(_book){
              Books.liked.push(_book);
              console.log(Books.liked);
            }
            
            i++;
          });
        }
        if(me.Creator){
          const allBooks = await book.find({uploader:me._id},exempt);//get all created books 
          if(allBooks.length>0){
            console.log('All books:',allBooks)
            allBooks.forEach(bk=>{

              Books.created.push(bk);//push books to OBj
              console.log(Books.created);
            });
          }
        }

        res.json({Books});


    }   
    else{
      throw 'User was not found';
    }

  }
  catch(error){
    res.status(403).send(error);
  }
}










module.exports={
    New_book,
    Update_book,
    Get_book,
    Get_books,
    Get_mine
}

