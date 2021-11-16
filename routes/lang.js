const { Router } = require('express');//destructure router from express
const {getLangs,postLang} = require('../controllers/langs_controller');

const router = Router(); // initialize router   //bookController.Up_book

router.get('/',getLangs);
router.post('/',postLang);



module.exports=router;