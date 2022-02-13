const { ObjectId } = require('bson');
const mongoose = require('mongoose'); 
const{currentTime}=require('../util/utils');

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
    languages:[],
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
    owner:{
        type:ObjectId,
        required:[true,'Missing owner']
    },
    uploader:{
        type:ObjectId,
        required:[true,'Missing uploader']
    },
    moment:{
        type:Date,
        default:currentTime()
    },
    played:{
        type:Number,
        default:0
    }

 },{
     timestamp:true
 });

 //STATICS....................................................................................................................

bookSchema.statics.userBooks = async function(user,state){
    try{
        if(!state&&!user){//check for parameters
            throw 'Arguement missing';
        }
        // console.log(user,state);
        // user = ObjectId(user);
        // 
        const exempt ='-__v -authors -category -description -languages -folder -uploader -owner';

        const books = await this.find({owner:user,status:state},exempt); //gather books
        if(!books){
            throw 'Error gathering books'
        }
        // console.log(books);
        
        return books;

    }
    catch(error){
        throw error;

    }

}



 const book = mongoose.model('Book',bookSchema);
 

module.exports={
    book
};

