const {book} = require('../models/bookModel');//books
const category = require('../models/category');//categories
// const {bookSeen, bookComment, bookReact} = require('../models/reactionModel');//reactions


//find all
const filterThorough = async(req,res)=>{
    const uploader = req.body.uploader
    const played = req.body.played
    // // const seen = req.body.seen
console.log(uploader,played);
    // //search
    // const byCategories = await book.find({category:cate,title:title});
    // console.log(byCategories);

    res.send('Cool');
}


//searching via keyword!
const search = async (req,res)=>{
    try{
        const books =[];
        const keyword = req.query.keyword;//get keyword from request
        // console.log('Hello');
        if(keyword.length<2||keyword.length<1){
            throw 'Try a longer word';
        }


        const viaCate = await book.find({category:{$regex: ".*" + keyword + ".*",$options:'igm'},status:"Active"});
        if(viaCate){ //if categories was a hit
            viaCate.forEach(book => {
                books.push(book);
            });
        }
        // console.log(books)
        let reg = `/.*${keyword}.*/`;

    const viaTitle = await book.find({title:{$regex: ".*" + keyword + ".*",$options:'igm'},status:"Active"});
        if(viaTitle){ //if title was a hit
            
            if(books.length<=0){
                viaTitle.forEach(book1 => {
                    books.push(book1);
                });
                // console.log('error')
            }
            else{
                viaTitle.forEach(book1 => {
                for(let i=0;i<=books.length;i++){
                    // console.log(books[i]._id==book1._id);
                    if(books[i]._id!== book1._id){
                        books.push(book1);
                    }
                }
            });
            
            }
            
        }
        // console.log(books)

        res.json({books});



    }
    catch(error){
        res.status(403).json({error});

    }
    


}





module.exports={
    filterThorough,
    search
}