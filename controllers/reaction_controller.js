const{ bookReact, bookComment} = require('../models/reactionModel');
const {mailer,decode_JWT,service,createFileDIr} = require('../util/utils'); 


const likeDislike = async (req,res)=>{
    try{
        const body = req.body;

        if(!req.cookies.jwt){//no user
            res.status(403).json({message:'Failed',status:'Error'});
        }

        const user = await decode_JWT(req.cookies.jwt);//get user id

        //check if reaction exists
        const reaction = await bookReact.findOne({user:user._id,bookID:body.book});

        if(reaction){
            //update reaction
            let action = await bookReact.findByIdAndUpdate({bookID:reaction._id},{action:body.action});
            if(!action){
                res.status(403).json({message:'Failed',status:'Error'});
            }
            res.status(200).json({message:'Success',status:'Success'});
        }
        else{
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



//new Comment
const comment = async (req,res)=>{
    try{
        if(!req.cookies.jwt){//no user found
            res.status(403).json({message:'No User found',status:'Error'});
        }
        const book = req.body;
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








module.exports={
    likeDislike,
    comment

}