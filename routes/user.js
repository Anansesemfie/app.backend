const { Router } = require('express');//destructure router from express
const {signup_post,login_post,getProfile,updateProfile,NewPassword,resetPassword,logout_get,verify_acct,login_signup,profile,reVerifyEmail,getOwners,updateBank} = require('../controllers/user_controller');
const {uploadCover} = require('../util/utils');

const router = Router();



router.post('/signup',signup_post);
router.post('/login',login_post);
router.post('/profile/fetch',getProfile);
router.post('/owner',getOwners);

//updates
router.post('/update',uploadCover.single('dp_cover'),updateProfile);
router.put('/',NewPassword);
router.put('/reset',resetPassword);
router.put('/bank',updateBank);
router.put('/reverify',reVerifyEmail);


router.get('/logout/:user',logout_get);
router.get('/verify/:id',verify_acct);

router.get('/',login_signup);//Login sign up page...........
router.get('/profile/:id',profile);//PAGE................



module.exports= router;