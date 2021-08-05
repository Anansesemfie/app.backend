const { Router } = require('express');//destructure router from express
const {New_book,Update_book,upFile,Get_book,Get_books} = require('../controllers/book_controller');

const {uploadCover,uploadAudio} = require('../util/utils');

const router = Router(); // initialize router   //bookController.Up_book

router.get('/',Get_books);
router.get('/:book',Get_book);
router.post('/upload',uploadCover.single('file'),New_book);//upload new book
router.get('/:action/:book',Update_book);
// router.post('/file',uploadAudio.single('cover'),upFile);





module.exports=router;