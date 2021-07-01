const mongoose = require('mongoose');


// book schema here
const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'This book needs a title!'],
        lowercase:true,
        maxlength:[20,'This is a very long name...']
    },
    description:{
        type:String,
        required:[true,'Say something to tease your audience'],
        minlength:[20,'Express yourself much more than this'],
        maxlength:[100,`Don't narrate the whole thing here`],
        lowercase:true
    },
    status:{
        type:String,
        required:true,
        default:'Pending'

    },
    snippet:{
        type:String

    },
    authors:[],
    category:[],
    cover:{
        type:String,
        required:[true,'Missing cover']
    },
    uploader:{
        type:String,
        required:[true,'Missing uploader']
    },
    moment:{
        type:Date,
        default:mongoose.now()
    }

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

// Reactions schema.......................................................................
const bookReactSchema = new mongoose.Schema({
    bookID:{
        type:String,
        required:[true,'Missing book to react']
    },
    user:{
        type:String,
        required:[true,'Missing to react to book']
    },
    action:{
        deault:"Like"
    },
    moment:{
        type:Date,
        default:mongoose.now()
    }
});

//like book


//unlike book


// Comments schema...............................................................................
const bookCommentSchema = new mongoose.Schema({
    bookID:{
        type:String,
        required:[true,'Missing book to comment on']
    },
    user:{
        type:String,
        required:[true,'Missing user to comment on book']
    },
    comment:{
        type:String,
        required:[true,'Comment is empty'],
        maxlength:[100,'Comment too long']
    },
    moment:{
        type:Date,
        default:mongoose.now()
    }
});

//add comment


 const book = mongoose.model('Book',bookSchema);
 const bookReact = mongoose.model('BookReact',bookReactSchema);
 const bookComment = mongoose.model('BookComment',bookCommentSchema);

module.exports={
    book,
    bookReact,
    bookComment
};

