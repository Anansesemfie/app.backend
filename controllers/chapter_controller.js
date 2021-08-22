const {mailer,decode_JWT,service,createAudioDIr} = require('../util/utils'); 
const {book} = require('../models/bookModel');
const chapter = require('../models/chapterModel');


const postChapter = async (req,res)=>{
    try{
        let file = req.file;
        let body = req.body;
        console.log(file,body);
        if(!file){
            res.json({Status:'File not uploaded'});
        }
        const thisBook = await book.findOne({_id:body.book});
        if(!thisBook){
            throw `book not found`;
        }
        else{

            const thisUser = await decode_JWT(req.cookies.jwt);
            console.log(thisBook.uploader,thisUser._id);

        if(thisBook.uploader != thisUser._id){//check for user and uploader
             throw `You don't own this book`;
        }
        else{
                console.log('attempt chapter'); 

            let createdChapter =await chapter.create({title:body.title,description:body.description,book:thisBook._id});

            if(!createdChapter){
                res.json({Status:`Chapter was not succesfully created`});
            }
            else{
                const thisFile = await createAudioDIr(thisBook.folder,file,body.title);
                if(thisFile){
                    chapter.findOneAndUpdate({_id:createdChapter._id},{file:thisFile.filename,mimetype:thisFile.mimetype}).then((data)=>{
                        console.log(data);

                    }).catch((err)=>{
                        throw err

                    });
                }
                else{
                    res.json({Status:'failed'});
                }

                
            }
            
            res.redirect(`/book/Read/${body.book}`);
              


        }

        }

    }
    catch(err){
        res.render('instruction');
    }

}

const getChapters = async (req,res)=>{
    try{
        let bookID = req.params.book;

        if(!bookID){
            res.status(400).send("Invalid book");
        }

        const chaps = await chapter.find({book:bookID});
        let validChaps=[];

        if(!req.cookies.jwt){
            for (let i = 0; i < 1; i++) {
                validChaps.push(chaps[i]);
                
            }
        }
        else{
            chaps.forEach(each=>{
                validChaps.push(each);
            });
        }

        res.json({validChaps});
    }
    catch(err){
        throw err;

    }
}


module.exports={
    postChapter,
    getChapters
}
