import { Router } from "express";
import { ActivateSubscription } from "../../../controllers/webHookCallBacks";

const route = Router();

route.get("/paystack", ActivateSubscription);

export default route;
