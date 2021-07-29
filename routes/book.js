const { Router } = require('express');//destructure router from express
const {New_book,Update_book,upFile} = require('../controllers/book_controller');

const {uploadCover,uploadAudio} = require('../util/utils');
const { route } = require('./user');

const router = Router(); // initialize router   //bookController.Up_book

router.post('/upload',uploadCover.single('file'),New_book);//upload new book
router.get('/:action/:book',Update_book);
router.post('/file',uploadAudio.single('cover'),upFile);




module.exports=router;