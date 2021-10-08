const { Router } = require('express');//destructure router from express
const {getPage,getSubscriptions,postSubscription,Subscribe} = require('../controllers/subscribe_controller');
const { checkAccount,checkUser } = require('../middleware/authMiddleware');

const router = Router(); // initialize router 

router.get('/',getPage);
router.get('/new',Subscribe)


router.post('/all',getSubscriptions);
router.post('/new',postSubscription);






module.exports = router;
