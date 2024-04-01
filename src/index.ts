import express, { Application } from "express";
import { PORT } from "./utils/env";
import Mongoose from "./db/models";

import ConsumerRouter from "./api/routes";

const app: Application = express();

//express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(ConsumerRouter);
Mongoose.connection
  .once("open", () => {
    console.log("Connected to MongoDB");
    app.emit("ready");
  })
  .on("error", (e) => {
    console.log(e);
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
