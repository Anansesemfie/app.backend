const fs = require('fs');
const chapter = require('../models/chapterModel');

const readFile = async (req,res)=>{
    const file = req.params.file;
    const range = req.headers.range;

    if(!range){
      res.status(400).send("Requires range");
    }

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
    const medStart = Number(range.replace(/\D/g,""));
    const medEnd = Math.min(medStart+chunk_size,medSize-1);

    //headers
    const content_length=medEnd-medStart+1;
    const headers={
      "Content-Type":`bytes${medStart}-${medEnd}/${medSize}`,
      "Accpets-Range":"bytes",
      "Content-Length":content_length,
      "Content-Type":medMime
    };

    //streaming now
 let readStream= fs.createReadStream(medPath,{medStart,medEnd});

    
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