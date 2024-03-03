import { Router, Request, Response } from "express";
import { PORT } from "../../utils/env";

import User from "./UserRoute";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Welcome to Anansesemfie",
    endpoints: {
      staging: `http://localhost:${PORT}/`,
      production: "coming soon....",
    },
    version: "1.0",
  });
});

router.use("/user", User);

export default router;
