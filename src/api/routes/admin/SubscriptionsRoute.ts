import { Router } from "express";
import {
  CreateSubscription,
  DeleteSubscription,
  GetStats,
  ListSubscriptions,
  UpdateSubscription,
} from "../../../controllers/admin/subscriptionsController";

const router = Router();

router.get("/stats", GetStats);
router.get("/all", ListSubscriptions);
router.post("/list", ListSubscriptions);
router.post("/create", CreateSubscription);
router.put("/:id", UpdateSubscription);
router.delete("/:id", DeleteSubscription);

export default router;
