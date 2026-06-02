"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./instrument");
const Sentry = __importStar(require("@sentry/node"));
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
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
});
app.use(consumer_1.default);
app.use("/admin", admin_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
Sentry.setupExpressErrorHandler(app);
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
