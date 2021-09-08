const {filterThorough,search} = require('../controllers/filter_controller');

const { Router } = require('express');//destructure router from express
const router = Router(); // initialize router





router.get('/',(req,res)=>{

    res.render('filtering');
});

router.get('/speci',filterThorough);
router.get('/find',search);

module.exports=router;