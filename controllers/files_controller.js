// const fs = require('fs');
const { book} = require('../models/bookModel');
const {bookSeen} = require('../models/reactionModel');
const {decode_JWT} =require('../util/utils');
const {subscribing} =require('../models/subscriptionModel');

const chapter = require('../models/chapterModel');
const User = require('../models/userModel');


const readFile = async (req,res)=>{
  try{
    const file = req.params.file;
    
    let length='';

        //file path
        const filePath = await chapter.findById({_id:file});
        if(!filePath){
          throw 'File was not found';
        }
        const audio ={
      path:filePath.file.slice(1),
      type:filePath.mimetype,
      title:filePath.title,
    }
        


        if(req.cookies.jwt){//if signed record played once
           let user = await decode_JWT(req.cookies.jwt);
           let userSub = await User.findOne({_id:user,active:true});//get user details
          if(!userSub.subscription){
            audio.length=0.3;
            audio.message='Subscribe to a plan';
        }
        else{
             
                        const see = await bookSeen.findOne({user:user._id,bookID:filePath.book});
                        if(!see.played){
                          const seen = await bookSeen.findByIdAndUpdate({_id:see._id},{played:true});
                          if(seen){
                            let record= await book.findByIdAndUpdate({_id:seen.bookID},{$inc:{played:1}});
                                  if(record){
                                    res.end(); 
                                  }
                                  else{
                                      throw 'Could not record seen';
                                  }
                          }
                        }
                        //check subscription status
                       
                        
                        
                          const sub = await subscribing.valid(userSub.subscription);
                        if(!sub){
                          throw 'Something unusual happened';
                        }

                        if(!sub.active){//inactive subscription

                          audio.lenth=0.3;
                          audio.message=sub.info;
                      }
                      else{//active subscription

                        audio.length=1;
                        audio.message=sub.info;
                      }
        }
          
          
         

        }
        else{
          audio.length=0.3;
            audio.message='Log in to get more';

        }


        
        console.log(audio)
        res.json({audio})
  }
  catch(error){
    console.log(error)
    res.status(403).json({error});
  }
    
}


module.exports={
    readFile
}