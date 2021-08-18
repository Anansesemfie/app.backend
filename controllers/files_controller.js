const fs = require('fs');
const chapter = require('../models/chapterModel');

const readFile = async (req,res)=>{
    const file = req.params.file;
    

    //file path
    const filePath = await chapter.findById({_id:file});
    if(!filePath){
      res.status(404).send("File was not found");
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