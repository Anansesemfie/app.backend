const { Router } = require('express');//destructure router from express
const userController = require('../controllers/user_controller');


const router = Router();



router.post('/signup',userController.signup_post);
router.post('/login',userController.login_post);
router.post('/profile/fetch',userController.getProfile);



router.get('/logout',userController.logout_get);
router.get('/verify/:id',userController.verify_acct);
router.get('/',userController.login_signup);
router.get('/profile/:id',userController.profile);



module.exports= router;