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
bookReactSchema.statics.countReact = async function (data) {
    /*
    */ 
    try{
        const {book,start,end,type} = data;

        if(!start&&!end&&!book&&!type) throw 'missing parameter in reaction count';

        let reactCount;
        let query;
        console.log(book);

        switch (type) {
            case 'Like'://likes
            query = await this.find({moment:{$gte:start,$lt:end},bookID:book,action:'Like'});
            if(!query) throw 'Error getting likes from reaction count';
                reactCount = query.length;
            break;
            default://dislike
            console.log('here')
            query = await this.find({moment:{$gte:start,$lt:end},bookID:book,action:'Dislike'});
            //  console.log(query);
            if(!query) throw 'Error getting dislikes from reaction count';
                reactCount = query.length;
            break;
        }

        return reactCount;


    }
    catch(error){
        throw error;
    }

}


bookSeenSchema.statics.countSeen = async function (data) {
    try{
        const {start,end,book} = data;

        if(!start&&!end&&!book&&!type) throw 'Missing some parameters in seen count';//if any of the parameters is missing

        let bookCount;

        
           
            const Played = await this.find({moment:{$gte:start,$lt:end},bookID:book._id,played:true});

            if(!Played) throw 'error getting seen'
            const bookPlayed= Played.length;

            const Seen = await this.find({moment:{$gte:start,$lt:end},bookID:book._id});
            if(!Seen) throw 'error getting seen'
            const bookSeen= Seen.length;



            

        return {bookPlayed,bookSeen};


    }
    catch(error){
        throw error;
    }
}



//add comment

const bookReact = mongoose.model('BookReact',bookReactSchema);
const bookComment = mongoose.model('BookComment',bookCommentSchema);
const bookSeen = mongoose.model('BookSeen',bookSeenSchema);

 module.exports={
     bookReact,
     bookComment,
     bookSeen
 }