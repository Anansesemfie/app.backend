const { Router } = require('express');//destructure router from express
const {getCategories,postCategories, postCategory} = require('../controllers/category_controller');

const router = Router(); // initialize router   //bookController.Up_book

router.get('/',getCategories);
router.post('/',postCategory);



module.exports=router;