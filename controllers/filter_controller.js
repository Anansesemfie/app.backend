const {book} = require('../models/bookModel');//books
const category = require('../models/category');//categories
// const {bookSeen, bookComment, bookReact} = require('../models/reactionModel');//reactions


//find all
const filterThorough = async(req,res)=>{
    try{
  //get values from body
    const played = req.body.played
    const cate = req.body.category;

    console.log(played==0,cate !="");

    let filtered; 
    //search
    if(cate !="" && played>0){//both are present
        console.log('missing nothing');
        filtered= await book.find({category:cate,played:{$gt:played},status:'Active'},'-_id'); 
    }
    else if(cate==""&& played>0){
        console.log('missing a bit of something');
        filtered= await book.find({played:{$gt:played},status:'Active'});
    }
    else if(cate!=""&& played==0){
        console.log('missing a lil something');
        filtered= await book.find({category:cate,status:'Active'},'-_id');
    }
    else{
        console.log('missing something');
        filtered= await book.find({status:'Active'});
    }

    //return something
     res.status(200).json(filtered);
    
    }
    catch(error){
        throw error;
    }
    

   
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