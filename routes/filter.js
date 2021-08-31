const { Router } = require('express');//destructure router from express
const router = Router(); // initialize router
const {filterThorough,search} = require('../controllers/filter_controller');



router.get('/',filterThorough);
router.get('/find',search);

module.exports=router;