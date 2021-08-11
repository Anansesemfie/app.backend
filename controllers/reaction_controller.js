const{ bookReact, bookComment, bookSeen} = require('../models/reactionModel');
const {mailer,decode_JWT,service,createFileDIr} = require('../util/utils'); 


const postReaction = async (req,res)=>{
    try{
        const body = req.body;
        console.log('here',body);

        if(!req.cookies.jwt){//no user
            res.json({message:'No User',status:'Error'});
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
        console.log(body);
        const user = await decode_JWT(req.cookies.jwt);//get user id


        //add new comment 
        let action = await bookComment.create({bookID:book.book,user:user._id,comment:body.comment});

        if(!action){
            res.status(403).json({message:'Failed',status:'Error'});
        }
        res.status(200).json({message:'Success',status:'Success'});



    }
    catch(err){

    console.log(err);

    }
}


//Seen
const postSeen = async (req,res)=>{
    try{
        if(!req.cookies.jwt){
            res.status(200).json({message:'user not logged in',status:'Attention'});
        }
        const book = req.params.book;
        const user = await decode_JWT(req.cookies.jwt);
        console.log(book,user);

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

        res.status(403).json({message:'Could not register seen',status:'Error'});

    }
    catch(err){

    }
}

const getSeen = async (req,res)=>{
    try{
        const book = req.params.book;
        const seen = await bookSeen.find({bookID:book});
        // console.log(book,seen);
        if(seen){
            res.status(200).json({seen:seen.length});
        }
        

    }
    catch(err){
        console.log(err);

    }
}









module.exports={
    postReaction,
    postComment,
    getReactions,
    postSeen,
    getSeen

}