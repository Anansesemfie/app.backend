const{ bookReact,bookSeen} = require('../models/reactionModel');
const { book} = require('../models/bookModel');
const {decode_JWT,daysInMonth,calculateMoney} = require('../util/utils'); 

//private
const report = async(bok)=>{
    /*
    1. get book 
    2. get this month
    3. get data from Reactions
    4. pass data to calculate money
    4. return info 
    */
    try{
        // console.log(bok)
        const thisMonth = daysInMonth()
        let monthStart = [thisMonth.year,thisMonth.month,'01'].join('-');
        let monthEnd = thisMonth.full

        // console.log(typeof bok._id,monthStart,monthEnd);
        const Dislikes = await bookReact.countReact({book:bok._id,//get dislikes via book id
            start:monthStart,
            end:monthEnd,
            type:'Dislike'});

           
        const seenPlayed = await bookSeen.countSeen({book:bok._id,
            start:monthStart,
            end:monthEnd});

        let Money = calculateMoney(seenPlayed.bookPlayed,Dislikes);
        
        return {Dislikes:{
            money:Money.Disliked_debit,
            dislikes:Dislikes
        },Played:{
            money:Money.Played_Credit,
            played:seenPlayed.bookPlayed

        },Total:Money.Total};


    }
    catch(error){
        throw error;

    }
}

// public
const countStream = async (req,res)=>{
    /*
    1.Get user ID
    2.Get all owned active books
    3.Get disliked and played reactions
    4.calculate money 
        1.multiply played by 0.05
        2.multiply dislikes by 0.05
        3.subtract dislike from played
        
    */
    try{
        if(req.cookies.jwt){


            const user = await decode_JWT(req.cookies.jwt);
            const boook = req.body.book;

            //get all books 
            const books = await book.findOne({_id:boook,owner:user,status:'Active'});
            if(!books){
                throw 'could not get books';
            }
            if(books.owner!=user._id){
                throw 'You do not own this book';
            }
               
                // console.log(books[i]);
                const Streams= await report(books);
                if(!Streams){
                    throw 'Error calculating streams';
                }
            
           
            // console.log(Streams);

            res.json({Streams});
        }
        else{
            res.end();

        }
                   
    }
    catch(error){
        console.log(error)
        res.status(403).json({error});
    }
}


module.exports={
    countStream,
    report
}