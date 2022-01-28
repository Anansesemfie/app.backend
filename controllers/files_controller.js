// const fs = require('fs');
const { book} = require('../models/bookModel');
const {bookSeen} = require('../models/reactionModel');
const {decode_JWT} =require('../util/utils');
const {subscribing} =require('../models/subscriptionModel');

const chapter = require('../models/chapterModel');
const User = require('../models/userModel');


const readFile = async (req,res)=>{
  try{
    const {chapterID,userID} = req.body;
    let user;

        //file path
        const filePath = await chapter.findById({_id:chapterID});
        if(!filePath){
          throw 'File was not found';
        }
        const audio ={
      path:filePath.file.slice(1),
      type:filePath.mimetype,
      title:filePath.title,
    }

    if(req.cookies.jwt){
      user = (await decode_JWT(req.cookies.jwt))._id;

    }
    else if(userID){
      user=userID
    }
    else{
      user=null;
    }
        


        if(user){//if signed record played once
           console.log(user);
           let userSub = await User.findOne({_id:user,active:true,loggedin:true});//get user details
           if(!userSub){
             throw 'User not found or not logged in';
           }
          if(!userSub.subscription){
            
            audio.length=0.3;
            if(filePath.title=="Sample"){
              audio.length=1;
            }
            audio.message='Subscribe to a plan';
        }
        else{
          
          
          //check subscription status      
                        
                          const sub = await subscribing.valid(userSub.subscription);
                        if(!sub){
                          throw 'Something unusual happened';
                        }

                        if(!sub.active){//inactive subscription

                          audio.length=0.3;
                          if(filePath.title=="Sample"){
                            audio.length=1;
                          }
                          audio.message=sub.info;
                      }
                      else{//active subscription
                        
                        let see = await bookSeen.findOne({user:user,bookID:filePath.book}); //get my seen reaction
                        if(!see.played){//check if played already
                          let seen = await bookSeen.updateOne({_id:see._id},{played:true});//mark as played
                          if(!seen){
                            throw 'Error while registering played';
                          }
                          let record= await book.updateOne({_id:seen.bookID},{$inc:{played:1}});//increase book played by 1
                                  if(!record){
                                    
                                      throw 'Could not record seen';
                                  }
                        }

                        audio.length=1;
                        audio.message=sub.info;
                      }



             
                        
                       
        }
          
          
         

        }
        else{
          audio.length=0.3;
          if(filePath.title=="Sample"){
            audio.length=1;
          }
            audio.message='Log in to get more';

        }


        
        // console.log(audio)
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