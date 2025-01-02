import {
  getSubscription,
  getSubscriptions,
} from "../../../controllers/subscriptionsController";
import { Router } from "express";

const router = Router();

router.get("/:subscriptionId", getSubscription);
router.get("/", getSubscriptions);

export default router;
