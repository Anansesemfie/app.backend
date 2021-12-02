const { Router } = require('express');//destructure router from express
const {getPage,getSubscriptions,postSubscription,Subscribe,afterPayment} = require('../controllers/subscribe_controller');
const { checkAccount,checkUser } = require('../middleware/authMiddleware');

const router = Router(); // initialize router 

router.get('/',getPage);
router.get('/new',Subscribe)
router.get('/callback',afterPayment);


router.post('/all',getSubscriptions);
router.post('/new',postSubscription);






module.exports = router;
