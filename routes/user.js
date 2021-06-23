const { Router } = require('express');//destructure router from express
const userController = require('../controllers/user_controller');


const router = Router();

router.get('/signup',userController.signup_get);

router.post('/signup',userController.signup_post);

router.get('/login',userController.login_get);

router.post('/login',userController.login_post);

router.get('/logout',userController.logout_get);

router.get('/verify/:id',userController.verify_acct);



module.exports= router;