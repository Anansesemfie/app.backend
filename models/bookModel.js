const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const Schema = mongoose.Schema


// book schema here
const bookSchema = new Schema({
    title:{
        type:String,
        required:[true,'This book needs a title!'],
        lowercase:false,
        maxlength:[50,'This is a very long title']
    },
    description:{
        type:String,
        required:[true,'Say something to tease your audience'],
        minlength:[10,'Express yourself much more than this'],
        maxlength:[1500,'Do not narrate the whole thing here'],
        lowercase:false
    },
    status:{
        type:String,
        required:true,
        default:'Active'
    },
    snippet:{
        type:String

    },
    authors:[],
    category:[],
    folder:{
        type:String,
        unique:false,
        required:false
    },
    cover:{
        type:String,
        default:'/images/user_fire.jpg',
        required:false,
        unique:false
    },
    uploader:{
        type:ObjectId,
        required:[true,'Missing uploader']
    },
    moment:{
        type:Date,
        default:mongoose.now()
    },
    played:{
        type:Number,
        default:0
    }

 },{
     timestamp:true
 });

 //STATICS..........................................................................

//  add author
bookSchema.static.authorPush = async (user,book_id)=>{
    try{
        const _book=await this.findOne({_id:book_id});
        if(_book){
            _book.author.push(user);
        }
        else{
            throw Error('Book can not be found');
        }

    }
    catch(err){
        throw Error('Author could not be added');
    }
}

// remove author
bookSchema.static.authorPop = async (user,book_id)=>{
    try{
        const _book=await this.findOne({_id:book_id});

        if(_book){
              let authorIndex = _book.author.indexOf(user);//get  "author" index
            _book.author.splice(authorIndex, 1); //remove car from the author array

        }
        else{
            throw Error('Book can not be found');
        }

    }
    catch(err){
        throw Error('Author could not be removed');
    }
}



 const book = mongoose.model('Book',bookSchema);
 

module.exports={
    book
};

