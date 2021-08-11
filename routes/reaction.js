const {postReaction, postComment, getReactions,postSeen,getSeen} = require('../controllers/reaction_controller');


const { Router } = require('express');//destructure router from express
const router = Router(); // initialize router   //bookController.Up_book



router.post('/like',postReaction);
router.post('/comment',postComment);
router.post('/seen/:book',postSeen);


router.get('/:book',getReactions);
router.get('/seen/:book',getSeen);




module.exports=router;