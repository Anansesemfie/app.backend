const mongoose = require('mongoose');

const Schema = mongoose.Schema

const fileSchema = new Schema({
    originalname:{
        type:String
    },
    buffer:{
        type:Buffer
    },
    mimetype:{
        type:String
    },
    size:{
        type:Number
    },
    encoding:{
        type:String
    }
});


fileSchema.static.locateFile=function(id){
    const file = this.findOne({_id:id});//search for file
    if(file){
        let fileBack = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return fileBack;
    }else{
        return 'file not found';
    }
}

const fileSystem = mongoose.model('file',fileSchema);

module.exports=fileSystem;