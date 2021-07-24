const { Router } = require('express');//destructure router from express
const {Up_book,upFile} = require('../controllers/book_controller');
const fileUpload = require('../models/media');  

const {uploadCover} = require('../util/utils');







const router = Router(); // initialize router   //bookController.Up_book

router.post('/upload',uploadCover.single('file'),Up_book);
// router.post('/file',uploadCover.single('cover'),upFile);




module.exports=router;