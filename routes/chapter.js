const { Router } = require('express');//destructure router from express
const router = Router(); // initialize router   //bookController.Up_book
const {uploadAudio} = require('../util/utils'); 
const {postChapter,getChapters} = require('../controllers/chapter_controller');

router.post('/upload',uploadAudio.single('file'),postChapter);
router.get('/:book',getChapters);






module.exports=router;