"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./utils/env");
const models_1 = __importDefault(require("./db/models"));
const consumer_1 = __importDefault(require("./api/routes/consumer"));
const admin_1 = __importDefault(require("./api/routes/admin"));
const periodJob_1 = require("./jobs/periodJob");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
//express middlewares
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("combined"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: env_1.ALLOWED_ORIGINS, credentials: true }));
app.use(consumer_1.default);
app.use("/admin", admin_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
models_1.default.connection
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
        console.log('Allowed Origins: ', env_1.ALLOWED_ORIGINS);
        app.listen(env_1.PORT, () => console.log(`Server started on PORT ${env_1.PORT}`));
        (0, periodJob_1.startPeriodJob)();
    }
    catch (error) {
        console.log(error);
    }
});
