const{ bookReact, bookComment, bookSeen} = require('../models/reactionModel');
const { book} = require('../models/bookModel');
const {mailer,decode_JWT,service,createFileDIr,realDate} = require('../util/utils'); 
const { ObjectId } = require('bson');
const exempt = '-__v';


const postReaction = async (req,res)=>{
    try{
        const {book,action} = req.body;
        // console.log('here',body);

        if(!req.cookies.jwt){//no user
           throw 'User ID not found';
        }

        const user = await decode_JWT(req.cookies.jwt);//get user id

        //check if reaction exists
        const reaction = await bookReact.findOne({user:user._id,bookID:book});
        if(!reaction){
            throw 'Something is wrong with reaction';
        }

        if(reaction){

            if(reaction.action===action){
            throw `Not possible to ${action} twice`;

        }
        
        if(reaction.action!==body.action){

            //update reaction
            let action = await bookReact.updateOne({_id:reaction._id},{action:action});
            if(!action){
                throw 'Error updating Reaction'
            }
            
        }
        
        
        }
        else{
            console.log('new');
            //new reaction
            let action = await bookReact.create({bookID:book,user:user._id,action:action});
            if(!action){
               throw 'Error initializing reaction';
            }
           

        }
        res.status(200).json({message:'Successful'});
    }
    catch(err){
        // console.log(err);
        res.status(403).json({error:err});
    }
}


const getReactions = async (req,res)=>{
    try{
        if(!req.params.book||req.params.book==''||req.params.book==undefined){
            throw 'Book Id missing';
        }
        const book = req.params.book;
        
        const likes = await bookReact.find({bookID:book,action:'Like'});
        if(!likes){
            throw 'Error Retrieving likes'
        }
        const dislikes = await bookReact.find({bookID:book,action:'Dislike'});
        if(!dislikes){
            throw 'Error Retrieving dislikes'
        }

        res.json({
            likes:likes.length,
            dislikes:dislikes.length
        });
    }
    catch(err){
        // console.log(err);
        res.status(403).json({error:err});

    }
}



//new Comment
const postComment = async (req,res)=>{
    try{
        if(!req.cookies.jwt){//no user found
            throw 'No user found';
        }
        const body = req.body;
        // console.log(body);
        const user = await decode_JWT(req.cookies.jwt);//get user id

        const thisBook = await book.findOne({_id:body.book,status:"Active"});
        // console.log(thisBook);

        if(!thisBook){//check if book is active
           throw 'Issues locating book';
        }

        //add new comment 
        let action = await bookComment.create({bookID:body.book,user:user._id,comment:body.comment});

        if(!action){
            throw 'Error adding comment'
        }
        res.status(200).json({message:'Success'});



    }
    catch(err){
        // console.log(err);
        res.status(403).json({error:err});

    }
}

//get Comments
const getComments = async (req,res)=>{
    try{ //attempt to get comment
        const thisBook = req.params.book;
        // console.log(thisBook);
        if(!thisBook){//no book was in request
            throw 'Book ID missing'
        }

        //get comments
        const comments = await bookComment.aggregate([{$match:{bookID:ObjectId(thisBook)}},{$lookup:{
            from:"users",
            localField:"user",
            foreignField:"_id",
            as:"commenter"
        }}]);

        // comments.forEach(com=>{
        //     com.moment=realDate(com.moment);
        // });

        comments.forEach(com=>{
            if(!com.commenter.dp){
                com.commenter.dp='/images/dp.png';
                

            }
            // console.log(com.commenter.dp);
        });


        res.json({comments})
;
        // db.users.aggregate([{$match:{"_id":"60def21ef6b0386590386672"}},{$lookup:{from:"books", localField:"_id", foreignField:"uploader", as:"User_books"}}]).pretty()
        }
    catch(err){
        res.status(403).json({error:err});

    }
}

//Seen
const postSeen = async (req,res)=>{
    try{
        if(!req.cookies.jwt){
            throw 'Log in is required'
        }
        const book = req.params.book;
        const user = await decode_JWT(req.cookies.jwt);
        // console.log(book,user);

        const see = await bookSeen.findOne({bookID:book,user:user});
        if(!see){
            //create new doc
            const seen = await bookSeen.create({bookID:book,user:user});
            if(!seen){
                throw 'Seen was not created';
               
            }
        }

        res.end();

    }
    catch(err){
        res.status(403).json({error:err});
    }
}

const getSeen = async (req,res)=>{
    try{
        if(!req.params.book){
            throw 'Book ID not found';
        }
        const book = req.params.book;
        const seen = await bookSeen.find({bookID:book});
        const played = await bookSeen.find({bookID:book,played:true});
        // console.log(book,seen);
        if(seen){
            res.status(200).json({seen:seen.length,played:played.length});
        }
        

    }
    catch(err){
        res.status(403).json({error:err});

    }
}









module.exports={
    postReaction,
    postComment,
    getComments,
    getReactions,
    postSeen,
    getSeen

}