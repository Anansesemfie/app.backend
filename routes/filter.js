const {filterThorough,search} = require('../controllers/filter_controller');

const { Router } = require('express');//destructure router from express
const router = Router(); // initialize router





router.get('/',filterThorough);
router.get('/find',search);

module.exports=router;