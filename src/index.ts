import express, { Application } from "express";
import cors from "cors";
import { PORT } from "./utils/env";
import Mongoose from "./db/models";

import ConsumerRouter from "./api/routes/consumer";
import AdminRouter from "./api/routes/admin";
import path from "path";

const app: Application = express();

//express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(ConsumerRouter);
app.use("/admin", AdminRouter);
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
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
app.on("ready", () => {
  try {
    app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
  } catch (error) {
    console.log(error);
  }
});
