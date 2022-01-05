const {countStream} = require('../controllers/report_controller');

const { Router } = require('express');//destructure router from express
const router = Router(); // initialize router   //bookController.Up_book


router.get('/month',countStream);



module.exports =router;