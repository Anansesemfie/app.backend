const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const Schema = mongoose.Schema

// Reactions schema.......................................................................
const bookReactSchema = new Schema({
    bookID:{
        type:ObjectId,
        required:[true,'Missing book to react']
    },
    user:{
        type:ObjectId,
        required:[true,'Missing to react to book']
    },
    action:{
        type:String,
        default:'Like'
    },
    moment:{
        type:Date,
        default:mongoose.now()
    }
});

//like book


//unlike book


// Comments schema...............................................................................
const bookCommentSchema = new Schema({
    bookID:{
        type:ObjectId,
        required:[true,'Missing book to comment on']
    },
    user:{
        type:ObjectId,
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

const bookSeenSchema = new Schema({
    bookID:{
        type:ObjectId,
        required:[true,'Book is required']
    },
    user:{
        type:ObjectId,
        required:[true,'User required'],
    },
    played:{
        type:Boolean,
        default:false
    },
    moment:{
        type:Date,
        default:mongoose.now()
    }
})



//add comment

const bookReact = mongoose.model('BookReact',bookReactSchema);
const bookComment = mongoose.model('BookComment',bookCommentSchema);
const bookSeen = mongoose.model('BookSeen',bookSeenSchema);

 module.exports={
     bookReact,
     bookComment,
     bookSeen
 }