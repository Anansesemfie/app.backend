const {mailer,decode_JWT,service,createAudioDIr} = require('../util/utils'); 
const {book} = require('../models/bookModel');
const chapter = require('../models/chapterModel');
const exempt = '-__v -file -mimetype -book';

const postChapter = async (req,res)=>{
    try{
        let file = req.file;
        let body = req.body;
        // console.log(file,body);
        if(!file){
           throw 'File not uploaded';
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
        
                console.log('attempt chapter'); 

            let createdChapter =await chapter.create({title:body.title,description:body.description,book:thisBook._id});

            if(!createdChapter){
                throw 'Chapter was not succesfully created';
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
                    throw 'Could not upload';
                }

                
            }
            
            res.redirect(`/book/Read/${body.book}`);
              


        

        }

    }
    catch(err){
        res.json({err});
    }

}

const updateChapter = async(req,res)=>{
    try{
        if(!req.cookies.jwt){
            throw 'Error identifying user';
        }
        const user =await decode_JWT(req.cookies.jwt);

        let file = req.file;
        let body = req.body;
        const chapID = body.chapter;
        const bookid = body.book;
        const uploadValues ={};

        

        const chapDetails = await chapter.findById(chapID);//get chapter details
        if(!chapDetails){
            throw 'Error fetching Chapter'
        }
        if(chapDetails.book!=bookid){//confirm book
            throw 'Error identifying book';
        }
        console.log(chapDetails.book);
        const bookDetails = await book.findById(chapDetails.book);//get book details
        if(!bookDetails){
            throw 'Error fetching Book';
        }

        if(bookDetails.uploader!=user._id){
            throw 'Error Identifying Owner';
        }




        //start updating chapter
        if(file){
            const newChap = await createAudioDIr(bookDetails.folder,file,chapDetails.title,chapDetails.file);
        if(newChap){
            uploadValues.file = newChap.filename;
        }
        else{
            throw 'Error making changes to file';
        }
        }
        
       
       uploadValues.title = body.title;
       uploadValues.description = body.description;
    //    update chapter now
    const updateChap = await chapter.findByIdAndUpdate(chapDetails._id,uploadValues);
    if(!updateChap){
        throw 'Could not update chapter';
    }

    res.redirect(`/book/Read/${updateChap.book}`);

    }
    catch(error){
        console.log(error);
        // throw error
        res.render('instruction',{error})
    }

}


const getChapters = async (req,res)=>{
    try{
        let bookID = req.params.book;

        if(!bookID){
            res.status(400).send("Invalid book");
        }

        const chaps = await chapter.find({book:bookID},exempt);
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
    getChapters,
    updateChapter
}
