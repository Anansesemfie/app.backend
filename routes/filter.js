const {filterThorough,search,expandFilter,page} = require('../controllers/filter_controller');

const { Router } = require('express');//destructure router from express
const router = Router(); // initialize router





router.get('/',page);
router.get('/:fstParam/:lstParam',page)

router.get('/speci',filterThorough);
router.get('/find',search);


router.post('/',expandFilter);

module.exports=router;