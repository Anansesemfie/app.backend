import { getComments,postComment } from "../../../controllers/commentController";

import { Router } from "express";

const router = Router()

router.post('/',postComment)
router.get('/:bookId',getComments)

export default router