const { book} = require('../models/bookModel');
const User = require('../models/userModel');
const{ bookReact} = require('../models/reactionModel');

const {mailer,decode_JWT,service,createFolderDIr} = require('../util/utils'); 
const exempt = '-__v -status -folder';



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
        languages:[],
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
      newBook.category=body.category;
      newBook.languages=body.language;
      newBook.uploader=await decode_JWT(req.cookies.jwt);
      newBook.authors = body.author.split('-');//split author strings into an array
      // newBook.cover = {originalname:file.originalname,encoding:file.encoding,mimetype:file.mimetype,buffer:file.buffer};

      // console.log(newBook.cover);

        let fileBack = await createFolderDIr(file,body.title);
        console.log(fileBack);

      let response = await book.create({title:newBook.title,description:newBook.description,folder:fileBack.location,cover:fileBack.cover,authors:newBook.authors,category:newBook.category,languages:newBook.languages,uploader:newBook.uploader});
      
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
  // console.log(action,bookID);
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
  let creator;

  console.log('get_book');
  
  if(req.cookies.jwt){//logged in user 
    bookBack= await book.findOne({_id:bookID},exempt);//get book from DB
    if(!bookBack){
      throw 'Something happened'
    }
    
    let user = await decode_JWT(req.cookies.jwt);
  
 console.log(bookBack);
  if(bookBack.uploader==user._id){
   
    creator=true;
  }
  else{
    creator=false;
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
    res.send(erros);
  }
 


}

const Get_books =async (req,res)=>{
  try{
    if(!req.body){
      throw 'no body'
  }

  // console.log('books');
  const reqBody={status:''};

      if(req.body.active){//if there was an active 

      switch (req.body.active) {//check param

          case "all"://all subscriptions
              delete reqBody.status;
              break;

          case "true"://just active subscription type

                  reqBody.status="Active";
          break;

          case "false"://just inactive subscription type
                  reqBody.status="Inactive";
          break;
      
          default:
              throw 'Keyword not recognized';
          break;
      }
      
      
       }
    else{
      reqBody.status="Active";
        }

     
    const books = await book.find(reqBody,exempt).sort({"_id":-1});;

      res.json({books});

  }
  catch(err){
    res.status(403).json({err});

  }
 
}

const Get_mine= async (req,res)=>{
  try{
    let {user}=req.body;
    const Books ={
      liked:[],
      created:[]
    }
    if(!user||user=='me'){//get user 
      if(!req.cookies.jwt){
        throw 'User not logged in'
      }
      user=(await decode_JWT(req.cookies.jwt))._id;
    }

    const me = await User.findOne({_id:user});
    if(me){
        const likes = await bookReact.find({user:me._id}).sort({"_id":-1});;//search for all liked books

        if(likes.length>=0){//push liked books
          console.log(likes.length>=1);
          let i=1;
          likes.forEach(async bk=>{
            let _book= await book.findOne({_id:bk.bookID},exempt);//get book by ID
            // console.log(i,_book);
            if(_book){
              Books.liked.push(_book);
              console.log(Books.liked);
            }
            
            i++;
          });
          
        }
        if(me.account ==='Creator'){
          const allBooks = await book.find({uploader:me._id},exempt).sort({"_id":-1});;//get all created books 
          if(allBooks.length>0){
            // console.log('All books:',allBooks)
            allBooks.forEach(bk=>{

              Books.created.push(bk);//push books to OBj
              // console.log(Books.created);
            });
          }
        }
        else{
          delete Books.created;
        }
        // console.log(Books);

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


const subscription = async(req,res)=>{
    try{
      res.send('subscribe');
    }
    catch(error){
      // res.status(403).json({error});
    }

}










module.exports={
    New_book,
    Update_book,
    Get_book,
    Get_books,
    Get_mine,
    subscription
}

