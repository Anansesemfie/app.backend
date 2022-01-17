const { book} = require('../models/bookModel');
const User = require('../models/userModel');
const{ bookReact} = require('../models/reactionModel');

const {mailer,decode_JWT,service,createFolderDIr,createImageDIr} = require('../util/utils'); 
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
        languages:[],
        cover:"",
        uploader:"",
        owner:""
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
      newBook.owner = body.owner;
      if(!newBook.owner){//no specified owner
        newBook.owner=newBook.uploader;//set uploader as owner
      }
      newBook.authors = body.author.split('-');//split author strings into an array
      // newBook.cover = {originalname:file.originalname,encoding:file.encoding,mimetype:file.mimetype,buffer:file.buffer};

      // console.log(newBook.cover);

        let fileBack = await createFolderDIr(file,body.title);
        console.log(fileBack);

      let response = await book.create({title:newBook.title,description:newBook.description,folder:fileBack.location,cover:fileBack.cover,authors:newBook.authors,category:newBook.category,languages:newBook.languages,uploader:newBook.uploader,owner:newBook.owner});
      
      if(!response){
     throw 'Could not create book';
      
      }
      res.redirect(`/book/Read/${response._id}`);
        
        
  }
  catch(err){
    console.log(err);
   const errors = handleError(err);
   res.render('instruction',{error:errors});
  }
}


//update book pages
const Update_book = async (req, res) => {
  try{
    if(!req.cookies.jwt){
      throw 'Error identifying User';
    }
    const user = await decode_JWT(req.cookies.jwt);

    const body = req.body;
    const file = req.file;
    const updateValues ={};

    const bookDetails = await book.findById(body.id);//get book details
    if(!bookDetails) throw 'Error fetching Book';
    
    if(bookDetails.uploader!=user._id){
      throw 'Error identifying Owner'
    }


    if(file){
      const newCover = await createImageDIr(bookDetails.folder,file,body.title,bookDetails.cover);
  if(newCover){
      updateValues.cover = newCover.filename;
      // console.log(newCover);
  }
  else{
      throw 'Error making changes to file';
  }
  }

  updateValues.title = body.title;
  updateValues.description = body.description;
  updateValues.category = body.category;
  updateValues.authors = body.author;
  updateValues.languages = body.language;

  const upBook = await book.findByIdAndUpdate(body.id,updateValues);
  if(!upBook) throw 'Error updating'




  res.redirect(`/book/Read/${body.id}`);
  }
  catch(error){
    res.render('instruction',{error})
// throw error
  }
}


//PAGE
const bookPage = async (req,res)=>{
  try{
    // const action=req.params.action;
      const bookID = req.params.book;
      // console.log(action,bookID);
      
          res.render(`book`);
  }
  catch(error){
    res.status(404).render('notFound');

  }
 
     
  
}

const Get_book = async (req,res)=>{
  try{
     let bookID = req.params.book;//get book id from request
    let bookBack;
    let creator=false;
    let owner=false;

  // console.log('get_book');
  
  if(req.cookies.jwt){//logged in user 
    bookBack= await book.findOne({_id:bookID},exempt);//get book from DB
    if(!bookBack){
      throw 'Something happened'
    }
    
    let user = await decode_JWT(req.cookies.jwt);
  
//  console.log(bookBack);
  if(bookBack.uploader==user._id){
   
    creator=true;
  }
 if(bookBack.owner==user._id){
    owner=true;

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
 
  res.json({bookBack,creator,owner});
  }
  catch(err){
    let erros = handleError(err);
    res.status(403).json(erros);
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
          console.log('none');
              delete reqBody.status;
              break;

          case "true"://just active subscription type
        console.log('active')
                  reqBody.status="Active";
          break;

          case "false"://just inactive subscription type
          console.log('inactive')
                  reqBody.status="Inactive";
          break;
      
          default:
              return
          break;
      }
      
      
       }
    else{
      reqBody.status="Active";
        }

     
    const books = await book.find(reqBody,exempt).sort({"_id":-1});;

      res.json({books});

  }
  catch(error){
    res.status(403).json({error});

  }
 
}

const Get_mine= async (req,res)=>{
  try{
    let {user}=req.body;
    const Books ={
      liked:[],
      created:[]
    };

    if(!user||user=='me'){//get user 
      if(!req.cookies.jwt){
        throw 'User not logged in'
      }
      user=(await decode_JWT(req.cookies.jwt))._id;
    }

    const me = await User.findOne({_id:user});
    if(!me){
      throw 'User not found';
    }
        const likes = await bookReact.find({user:me._id,action:"Like"}).sort({"_id":-1});;//search for all liked books
        if(!likes){
          throw 'Error getting liked books';
        }
        
        let likesLength = likes.length;
        // console.log(likes[(likesLength-1)].bookID);
        
        for(let i=0;i<=(likesLength-1);i++){
          let thisBook=likes[i].bookID;
          let _book= await book.find({_id:thisBook},exempt);//get book by ID
          // let bookFinal = _book[0];
          // console.log(bookFinal);
          if(_book){
             Books.liked.push(_book[0]);
          }
          if(!_book){
            throw 'Something unusual happened';
          }
         
        }
                 
                
                
    switch (me.account) {
      case 'Creator':
      let uploaderBooks = await book.find({uploader:me._id},exempt).sort({"_id":-1});;//get all created books       
                if(uploaderBooks.length>0){
                            // console.log('All books:',uploaderBooks)
                            uploaderBooks.forEach(bk=>{

                              Books.created.push(bk);//push books to OBj
                              // console.log(Books.created);
                            });
                          }
      break;

      case 'Owner':
          let authorBooks = await book.find({owner:me._id},exempt).sort({"_id":-1});;//get all created books 
                   
          if(authorBooks.length>0){
                      // console.log('All books:',authorBooks)
                      authorBooks.forEach(bk=>{

                        Books.created.push(bk);//push books to OBj
                        // console.log(Books.created);
                      });
                    }
        break;
        

    
      default:
        delete Books.created;
        break;
    }


        // console.log(Books);

        res.json({Books});

  }
  catch(error){
    console.log(error);
    res.status(403).send(error);
  }
}




module.exports={
    New_book,
    bookPage,
    Update_book,
    Get_book,
    Get_books,
    Get_mine
}

