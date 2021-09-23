const { Router } = require('express');//destructure router from express
const userController = require('../controllers/user_controller');
const {uploadCover} = require('../util/utils');

const router = Router();



router.post('/signup',userController.signup_post);
router.post('/login',userController.login_post);
router.post('/profile/fetch',userController.getProfile);

//updates
router.post('/update',uploadCover.single('dp_cover'),userController.updateProfile);
router.put('/',userController.NewPassword);


router.get('/logout',userController.logout_get);
router.get('/verify/:id',userController.verify_acct);
router.get('/',userController.login_signup);
router.get('/profile/:id',userController.profile);



module.exports= router;