const fs = require('fs');
const chapter = require('../models/chapterModel');

const readFile = async (req,res)=>{
    const file = req.params.file;
    

    //file path
    const filePath = await chapter.findById({_id:file});
    if(!filePath){
      res.status(404).send("Video was not found");
    }

    const medPath = './uploads'+filePath.file.slice(1);
    const medMime = filePath.mimetype;

    const medSize = fs.statSync(medPath).size;

    //start media processing
    const chunk_size = 10**6//1mb

    //headers
    // const content_length=medEnd-medStart+1;
    const headers={
      "Content-Type":`bytes`,
      "Accpets-Range":"bytes",
      "Content-Type":medMime
    };

    //streaming now
 let readStream= fs.createReadStream(medPath);

    
    res.writeHead(206,headers)
   

    // This will wait until we know the readable stream is actually valid before piping
  readStream.on('open', function () {
    // This just pipes the read stream to the response object (which goes to the client)
    readStream.pipe(res);
  });

  // This catches any errors that happen while creating the readable stream (usually invalid names)
  readStream.on('error', function(err) {
    res.end();
  });
}


module.exports={
    readFile
}