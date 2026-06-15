import "./instrument";
import * as Sentry from "@sentry/node";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { PORT, ALLOWED_ORIGINS } from "./utils/env";
import Mongoose from "./db/models";

import ConsumerRouter from "./api/routes/consumer";
import AdminRouter from "./api/routes/admin";
import { startPeriodJob } from "./jobs/periodJob";
import path from "path";

const app: Application = express();

//express middlewares
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use(ConsumerRouter);
app.use("/admin", AdminRouter);
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
Sentry.setupExpressErrorHandler(app);
Mongoose.connection
  .once("open", () => {
    console.log("Connected to DB");
    app.emit("ready");
  })
  .on("error", (e) => {
    console.error(e);
    console.log("Couldn't connect to DB");
    app.emit("error");
  });

//Start server --------------------------------
app.on("ready", async () => {
  try {
    console.log('Allowed Origins: ', ALLOWED_ORIGINS);
    app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    await startPeriodJob();
  } catch (error) {
    console.log(error);
  }
});
