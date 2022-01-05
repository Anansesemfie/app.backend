const { Router } = require('express');//destructure router from express
const {New_book,bookPage,Update_book,upFile,Get_book,Get_books,Get_mine} = require('../controllers/book_controller');

const {uploadCover} = require('../util/utils');

const router = Router(); // initialize router   //bookController.Up_book


router.get('/:book',Get_book);
router.get('/Read/:book',bookPage);//page route


router.post('/',Get_books);
router.post('/upload',uploadCover.single('file'),New_book);//upload new book
router.post('/user',Get_mine);//user books
router.post('/update',uploadCover.single('file'),Update_book);





module.exports=router;