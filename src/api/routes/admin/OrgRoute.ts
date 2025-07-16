import {
  CreateOrg,
  FetchAllOrgs,
  FetchOrg,
  UpdateOrg
} from "../../../controllers/admin/organizationController";
import { Router } from "express";
const router = Router();

router.post("/create", CreateOrg);
router.get("/", FetchAllOrgs);
router.get("/:id", FetchOrg);
router.put("/:id", UpdateOrg);

export default router;
