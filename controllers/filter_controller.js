const {book} = require('../models/bookModel');//books
const category = require('../models/category');//categories
// const {bookSeen, bookComment, bookReact} = require('../models/reactionModel');//reactions
const exempt = '-__v -status -folder -uploader';

//find all
const filterThorough = async(req,res)=>{
    try{
  //get values from body
    const played = req.query.played
    const cate = req.query.category;

    console.log(played==0,cate !="");
    
    let filtered; 
    //search
    if(cate !="" && played>0){//both are present
        console.log('missing nothing');
        filtered= await book.find({category:cate,played:{$gt:played},status:'Active'},exempt); 
    }
    else if(cate==""&& played>0){
        console.log('missing a bit of something');
        filtered= await book.find({played:{$gt:played},status:'Active'},exempt);
    }
    else if(cate!=""&& played==0){
        console.log('missing a lil something');
        filtered= await book.find({category:cate,status:'Active'},exempt);
    }
    else{
        console.log('missing something');
        filtered= await book.find({status:'Active'},exempt);
    }

    //return something
     res.json({filtered});
    
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


        const viaCate = await book.find({category:{$regex: ".*" + keyword + ".*",$options:'igm'},status:"Active"},exempt);
        if(viaCate){ //if categories was a hit
            viaCate.forEach(book => {
                books.push(book);
            });
        }
        // console.log(books)
        let reg = `/.*${keyword}.*/`;

    const viaTitle = await book.find({title:{$regex: ".*" + keyword + ".*",$options:'igm'},status:"Active"},exempt);
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