const { Router } = require('express');//destructure router from express
const {New_book,Update_book,upFile,Get_book,Get_books,Get_mine,subscription} = require('../controllers/book_controller');

const {uploadCover} = require('../util/utils');

const router = Router(); // initialize router   //bookController.Up_book


router.get('/:book',Get_book);
router.get('/:action/:book',Update_book);


router.post('/',Get_books);
router.post('/upload',uploadCover.single('file'),New_book);//upload new book
router.post('/user',Get_mine);





module.exports=router;