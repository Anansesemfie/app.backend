const{ bookReact, bookComment, bookSeen} = require('../models/reactionModel');
const { book} = require('../models/bookModel');
const {mailer,decode_JWT,service,createFileDIr,realDate} = require('../util/utils'); 
const { ObjectId } = require('bson');
const exempt = '-__v';


const postReaction = async (req,res)=>{
    try{
        const body = req.body;
        // console.log('here',body);

        if(!req.cookies.jwt){//no user
            res.status(403).json({message:'No User',status:'Error'});
        }

        const user = await decode_JWT(req.cookies.jwt);//get user id

        //check if reaction exists
        const reaction = await bookReact.findOne({user:user._id,bookID:body.book});
        if(reaction){

            if(reaction.action===body.action){
            // already exist
            res.status(200).json({message:'Already Liked',status:'Warning'});

        }
        
        if(reaction.action!==body.action){

            //update reaction
            let action = await bookReact.findByIdAndUpdate({_id:reaction._id},{action:body.action});
            if(!action){
                res.status(403).json({message:'Failed',status:'Error'});
            }
            res.status(200).json({message:'Success',status:'Success'});
        }
        
        }
        else{
            console.log('new');
            //new reaction
            let action = await bookReact.create({bookID:body.book,user:user._id,action:body.action});
            if(!action){
                res.status(403).json({message:'Failed',status:'Error'});
            }
            res.status(200).json({message:'Success',status:'Success'});

        }
    }
    catch(err){

        console.log(err);
    }
}


const getReactions = async (req,res)=>{
    try{
        const book = req.params.book;
        if(!book){
            res.status(400).json({message:'No book',status:'Error'});
        }
        const likes = await bookReact.find({bookID:book,action:'Like'});
        const dislikes = await bookReact.find({bookID:book,action:'Dislike'});

        res.json({
            likes:likes.length,
            dislikes:dislikes.length
        });
    }
    catch(err){
        console.log(err);

    }
}



//new Comment
const postComment = async (req,res)=>{
    try{
        if(!req.cookies.jwt){//no user found
            res.status(403).json({message:'No User found',status:'Error'});
        }
        const body = req.body;
        // console.log(body);
        const user = await decode_JWT(req.cookies.jwt);//get user id

        const thisBook = await book.findOne({_id:body.book,status:"Active"});
        // console.log(thisBook);

        if(!thisBook){//check if book is active
            res.status(403).json({message:'Book not found',status:'Error'});
        }

        //add new comment 
        let action = await bookComment.create({bookID:body.book,user:user._id,comment:body.comment});

        if(!action){
            res.status(403).json({message:'Failed',status:'Error'});
        }
        res.status(200).json({message:'Success',status:'Success'});



    }
    catch(err){

    console.log(err);

    }
}

//get Comments
const getComments = async (req,res)=>{
    try{ //attempt to get comment
        const thisBook = req.params.book;
        // console.log(thisBook);
        if(!thisBook){//no book was in request
            res.status(403).json({message:'No specific book to check',status:'Attention'});
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
        console.log(err);
    }
}

//Seen
const postSeen = async (req,res)=>{
    try{
        if(!req.cookies.jwt){
            res.status(403).json({message:'user not logged in',status:'Attention'});
        }
        const book = req.params.book;
        const user = await decode_JWT(req.cookies.jwt);
        // console.log(book,user);

        const see = await bookSeen.findOne({bookID:book,user:user});
        if(!see){
            //create new doc
            const seen = await bookSeen.create({bookID:book,user:user});
            if(seen){
                res.end();
            }
            else{
                throw Error('Seen was not created');
            }
        }

        res.end();

    }
    catch(err){

    }
}

const getSeen = async (req,res)=>{
    try{
        const book = req.params.book;
        const seen = await bookSeen.find({bookID:book});
        const played = await bookSeen.find({bookID:book,played:true});
        // console.log(book,seen);
        if(seen){
            res.status(200).json({seen:seen.length,played:played.length});
        }
        

    }
    catch(err){
        console.log(err);

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