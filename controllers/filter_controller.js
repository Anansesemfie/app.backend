const {book} = require('../models/bookModel');//books
const category = require('../models/category');//categories
// const {bookSeen, bookComment, bookReact} = require('../models/reactionModel');//reactions
const exempt = '-__v -status -folder -uploader';

//find all
const filterThorough = async(req,res)=>{
    try{
  //get values from body
    const played = req.query.played;
    const cate = req.query.category;
    const lang = req.query.language;

    console.log(played==0,cate=="",lang);
    
    let filtered; 
    //search
    if(cate !="" && lang !="" && played>0){//all are present
        console.log('all are present');
        filtered= await book.find({category:cate,played:{$gt:played-1},status:'Active'},exempt).sort({"_id":-1});
    }
    else if(cate==""&& lang==""&& played>0){//just played
        console.log('just played');
        filtered= await book.find({played:{$gt:played-1},status:'Active'},exempt).sort({"_id":-1});
    }
    else if(cate!=""&& lang=="" && played==0){//just category
        console.log('just category');
        filtered= await book.find({category:cate,status:'Active'},exempt).sort({"_id":-1});
    }
    else if(cate==""&& lang!=""&& played==0){//just language
        console.log('just language');
        filtered= await book.find({languages:lang,status:'Active'},exempt).sort({"_id":-1});
    }
    else if(cate!=""&& lang!=""&&played==0){//category and language
        console.log('category and language');
        filtered= await book.find({languages:lang,category:cate,status:'Active'},exempt).sort({"_id":-1});
    }
    else if(cate!=""&& lang==""&&played>0){//category and played
        console.log('category and played');
        filtered= await book.find({played:{$gt:played-1},category:cate,status:'Active'},exempt).sort({"_id":-1});
    }
    else if(cate==""&& lang!=""&&played>0){//language and played
        console.log('language and played');
        filtered= await book.find({played:{$gt:played-1},languages:lang,status:'Active'},exempt).sort({"_id":-1});
    }
    else{
        console.log('missing something');
        filtered= await book.find({status:'Active'},exempt).sort({"_id":-1});
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


        const viaCate = await book.find({category:{$regex: ".*" + keyword + ".*",$options:'igm'},status:"Active"},exempt).sort({"_id":-1});;
        if(viaCate){ //if categories was a hit
            viaCate.forEach(book => {
                books.push(book);
            });
        }
        // console.log(books)
        let reg = `/.*${keyword}.*/`;

    const viaTitle = await book.find({title:{$regex: ".*" + keyword + ".*",$options:'igm'},status:"Active"},exempt).sort({"_id":-1});;
        if(viaTitle.length>=1){ //if title was a hit
            
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
        const viaLang = await book.find({languages:{$regex: ".*" + keyword + ".*",$options:'igm'},status:"Active"},exempt).sort({"_id":-1});;
        if(viaLang){ //if language was a hit
            
            if(books.length<=0){
                viaLang.forEach(book1 => {
                    books.push(book1);
                });
                // console.log('error')
            }
            else{
                viaLang.forEach(book1 => {
                for(let i=0;i<=books.length;i++){
                    // console.log(books[i]._id==book1._id);
                    if(books[i]._id!== book1._id){
                        books.push(book1);
                    }
                }
            });
            
            }
            
        }
        console.log(books)

        res.json({books});



    }
    catch(error){
        res.status(403).json({error});
        // console.log(error);

    }
    


}

const expandFilter = async(req,res)=>{
    try{
        // get params from request
        const fstParam = req.body.fstParam;
        const lstParam = req.body.lstParam;
        const books=[];

        console.log(fstParam,lstParam);
        
        

        switch(fstParam){
            case "category"://if category is the first param 

                let newLast = lstParam.split("%20");
               const finalParam = newLast.join(" ")
                console.log(finalParam);
            
                const catBooks = await book.find({ category:finalParam},exempt).sort({"_id":-1}); ;
                 if(!catBooks){
                    throw `Failed to find category`;
                }
                catBooks.forEach(bk=>{
                      
                    books.push(bk);
                })
              
               
            break;

            case "user"://if user is the first param
                const usrBooks = await book.find({uploader:lstParam},exempt).sort({"_id":-1});;
                if(!usrBooks){
                    throw new Error(`Failed to find category`);
                }
                usrBooks.forEach(bk=>{
                    books.push(bk);
                })

            break;

            default:
                books = `Invalid request`;

                break;
        }

        // console.log(books);

        res.json({books});
        
    }
    catch(error){
        res.status(403).json({error});
    }
}



const page = async(req,res)=>{

    res.render('filtering');
}



module.exports={
    filterThorough,
    search,
    expandFilter,
    page
}