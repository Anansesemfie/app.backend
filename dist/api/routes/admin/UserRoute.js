"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../../../controllers/admin/userController");
const CheckApp_1 = require("../../../api/middlewares/CheckApp");
const router = (0, express_1.Router)();
router.post("/add", CheckApp_1.CHECKAPPTOKEN, userController_1.CreateUser);
router.post("/login", userController_1.LoginUser);
router.post("/sendEmail", CheckApp_1.CHECKAPPTOKEN, userController_1.SendEmail);
router.post("/fetchUsers", CheckApp_1.CHECKAPPTOKEN, userController_1.FetchUsers);
router.put("/makeAssociate", CheckApp_1.CHECKAPPTOKEN, userController_1.MakeAssociate);
exports.default = router;
