const {decode_JWT,createAudioDIr} = require('../util/utils'); 
const {book} = require('../models/bookModel');
const {subscribing} =require('../models/subscriptionModel');
const User = require('../models/userModel');
const chapter = require('../models/chapterModel');
const exempt = '-__v -file -mimetype -book';

const postChapter = async (req,res)=>{
    try{
        let file = req.file;
        let body = req.body;
        // console.log(file,body);
        if(!file){
           throw 'File not uploaded';
        }
        const thisBook = await book.findOne({_id:body.book});
        if(!thisBook){
            throw `book not found`;
        }
        else{

            const thisUser = await decode_JWT(req.cookies.jwt);
            console.log(thisBook.uploader,thisUser._id);

        if(thisBook.uploader != thisUser._id){//check for user and uploader
             throw `You don't own this book`;
        }
        
                // console.log('attempt chapter'); 

            let createdChapter =await chapter.create({title:body.title,description:body.description,book:thisBook._id});

            if(!createdChapter){
                throw 'Chapter was not succesfully created';
            }
            else{
                const thisFile = await createAudioDIr(thisBook.folder,file,body.title);
                if(thisFile){
                    chapter.updateOne({_id:createdChapter._id},{file:thisFile.filename,mimetype:thisFile.mimetype}).then((data)=>{
                        console.log(data);

                    }).catch((err)=>{
                        throw err

                    });
                }
                else{
                    throw 'Could not upload';
                }

                
            }
            
            res.redirect(`/book/Read/${body.book}`);

        }

    }
    catch(err){
        res.render('instruction',{error:err});
    }

}

const updateChapter = async(req,res)=>{
    try{
        if(!req.cookies.jwt){
            throw 'Error identifying user';
        }
        const user =await decode_JWT(req.cookies.jwt);

        let file = req.file;
        let body = req.body;
        const chapID = body.chapter;
        const bookid = body.book;
        const uploadValues ={};

        

        const chapDetails = await chapter.findById(chapID);//get chapter details
        if(!chapDetails){
            throw 'Error fetching Chapter'
        }
        if(chapDetails.book!=bookid){//confirm book
            throw 'Error identifying book';
        }
        console.log(chapDetails.book);
        const bookDetails = await book.findById(chapDetails.book);//get book details
        if(!bookDetails){
            throw 'Error fetching Book';
        }

        if(bookDetails.uploader!=user._id){
            throw 'Error Identifying Owner';
        }




        //start updating chapter
        if(file){
            const newChap = await createAudioDIr(bookDetails.folder,file,chapDetails.title,chapDetails.file);
        if(newChap){
            uploadValues.file = newChap.filename;
        }
        else{
            throw 'Error making changes to file';
        }
        }
        
       
       uploadValues.title = body.title;
       uploadValues.description = body.description;
    //    update chapter now
    const updateChap = await chapter.findByIdAndUpdate(chapDetails._id,uploadValues);
    if(!updateChap){
        throw 'Could not update chapter';
    }

    res.redirect(`/book/Read/${updateChap.book}`);

    }
    catch(error){
        console.log(error);
        // throw error
        res.render('instruction',{error})
    }

}


const getChapters = async (req,res)=>{
    try{
        const {bookID,userID} = req.body;
        // console.log(req.body);
        let user;

        if(!bookID){

            throw 'Invalid book';
        }

        if(req.cookies.jwt){
            user = (await decode_JWT(req.cookies.jwt))._id;
        }
        else if(userID){

            user=userID;
        }
        else{
            user=null;
        }

        const chaps = await chapter.find({book:bookID},exempt);
        if(!chaps){
            throw 'Invalid book';
        }

        let validChaps;
        let message='';

        if(!user){
             let returnedChaps = chaps.filter((chap) => {
                if(chap.title == "Sample"){
                return chap
                }
                
                });

                if(returnedChaps.length==0||returnedChaps.length>1){
                    let myBook =[chaps[0]]
                    returnedChaps=myBook;
                }
           
                validChaps=returnedChaps;
            
        }
        else{
             
            //check subscription 
            // console.log(user);
            let userSub = await User.findOne({_id:user,active:true});//get user details
            if(!userSub){
                throw 'An Active User was not found';
            }
            
            if(!userSub.subscription){
                validChaps.push(chaps[0]);
                message='Subscription not found';

            }
            else{
                let subscription = await subscribing.valid(userSub.subscription);
            // console.log(subscription);
            if(!subscription.active){
                let returnedChaps = chaps.filter((chap) => {
                    if(chap.title == "Sample"){
                    return chap
                    }
                    
                    });
    
                    if(returnedChaps.length==0||returnedChaps.length>1){
                        let myBook =[chaps[0]]
                        returnedChaps=myBook;
                    }
               
                    validChaps=returnedChaps;

                message=subscription.info;
            }
            else{

               validChaps = chaps.filter((chap)=>{
                   if(chap.title!="Sample"){
                       return chap;
                   }
               });

                message=subscription.info;
            }
            }
            
            
        }
        // console.log(validChaps,message);
        if(validChaps[0]==undefined){
            res.json({chapters:[],info:message});
        }
        else{
            res.json({chapters:validChaps,info:message});
        }

        
    }
    catch(error){
        console.log(error);
        res.status(403).json({error:error});

    }
}


module.exports={
    postChapter,
    getChapters,
    updateChapter
}
