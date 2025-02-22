import { Router } from "express";
import { ActivateSubscription } from "../../../controllers/webHookCallBacks";

const route = Router();

route.put("/paystack", ActivateSubscription);

export default route;
