const { Router } = require('express');//destructure router from express
const {readFile} = require('../controllers/files_controller');

const router = Router(); // initialize router 

router.post('/',readFile);





module.exports = router;