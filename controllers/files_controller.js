const fs = require('fs');
const chapter = require('../models/chapterModel');
const {bookSeen} = require('../models/reactionModel');
const {decode_JWT} =require('../util/utils');

const readFile = async (req,res)=>{
    const file = req.params.file;
    
    

    //file path
    const filePath = await chapter.findById({_id:file});
    if(!filePath){
      res.status(404).send("File was not found");
    }

    if(req.cookies.jwt){//if signed record played once
      let user = await decode_JWT(req.cookies.jwt);
      const see = await bookSeen.findOne({user:user._id,bookID:filePath.book});
      if(!see.played){
        const seen = await bookSeen.findByIdAndUpdate({_id:see._id},{played:true});
        if(seen){
          console.log('played');
        }
      }

    }

    const medPath = filePath.file.slice(1);
    const medMime = filePath.mimetype;

    res.json({
      medPath,
      medMime,
      title:filePath.title
    })
}


module.exports={
    readFile
}