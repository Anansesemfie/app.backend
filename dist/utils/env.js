"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SENTRY_DSN = exports.ALLOWED_ORIGINS = exports.STARTUP_SUBSCRIPTION = exports.PAYSTACK_SECRET_KEY = exports.PAYSTACK_PUBLIC_KEY = exports.AWS_S3_BUCKET_AUDIO = exports.AWS_S3_BUCKET_IMAGES = exports.AWS_REGION = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY_ID = exports.CAN_LOG = exports.APP_BASE_URL = exports.BASE_URL = exports.BREVO_ACTIVE_WHATSAPP_SENDER = exports.BREVO_WHATSAPP_SENDER = exports.BREVO_KEY = exports.SENDGRID_KEY = exports.EMAIL_PASSWORD = exports.EMAIL_OPERAND = exports.SECRET_JWT = exports.APP_LOGO = exports.SERVER_LOG_FILE = exports.PORT = exports.HOST_URI = exports.MONGODB_DBNAME = exports.MONGODB_URI = void 0;
require("dotenv/config");
const isProduction = process.env.NODE_ENV === "production";
exports.MONGODB_URI = (_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : "";
exports.MONGODB_DBNAME = (_b = process.env.MONGODB_DBNAME) !== null && _b !== void 0 ? _b : "";
exports.HOST_URI = (_c = process.env.HOST_URI) !== null && _c !== void 0 ? _c : "localhost";
exports.PORT = (_d = process.env.PORT) !== null && _d !== void 0 ? _d : 5000;
exports.SERVER_LOG_FILE = (_e = process.env.SERVER_LOG_FILE) !== null && _e !== void 0 ? _e : "/logs.log";
exports.APP_LOGO = (_f = process.env.APP_LOGO) !== null && _f !== void 0 ? _f : "";
exports.SECRET_JWT = (_g = process.env.SECRET_JWT) !== null && _g !== void 0 ? _g : "";
exports.EMAIL_OPERAND = (_h = process.env.EMAIL_OPERAND) !== null && _h !== void 0 ? _h : "mancuniamoe@mail.com";
exports.EMAIL_PASSWORD = (_j = process.env.EMAIL_PASSWORD) !== null && _j !== void 0 ? _j : "";
exports.SENDGRID_KEY = (_k = process.env.SENDGRID_KEY) !== null && _k !== void 0 ? _k : "";
exports.BREVO_KEY = (_l = process.env.BREVO_KEY) !== null && _l !== void 0 ? _l : "";
/** Sender phone number registered in the Brevo WhatsApp dashboard (E.164 format, e.g. "+233241234567") */
exports.BREVO_WHATSAPP_SENDER = (_m = process.env.BREVO_WHATSAPP_SENDER) !== null && _m !== void 0 ? _m : "";
exports.BREVO_ACTIVE_WHATSAPP_SENDER = Number(process.env.BREVO_ACTIVE_WHATSAPP_SENDER) > 1 ? true : false;
exports.BASE_URL = (_o = process.env.BASE_URL) !== null && _o !== void 0 ? _o : "";
exports.APP_BASE_URL = (_p = process.env.APP_BASE_URL) !== null && _p !== void 0 ? _p : "";
exports.CAN_LOG = process.env.CAN_LOG === "YES";
exports.AWS_ACCESS_KEY_ID = (_q = process.env.AWS_ACCESS_KEY_ID) !== null && _q !== void 0 ? _q : "";
exports.AWS_SECRET_ACCESS_KEY = (_r = process.env.AWS_SECRET_ACCESS_KEY) !== null && _r !== void 0 ? _r : "";
exports.AWS_REGION = (_s = process.env.AWS_REGION) !== null && _s !== void 0 ? _s : "";
exports.AWS_S3_BUCKET_IMAGES = (_t = process.env.AWS_S3_BUCKET_IMAGES) !== null && _t !== void 0 ? _t : "";
exports.AWS_S3_BUCKET_AUDIO = (_u = process.env.AWS_S3_BUCKET_AUDIO) !== null && _u !== void 0 ? _u : "";
exports.PAYSTACK_PUBLIC_KEY = (_v = process.env.PAYSTACK_PUBLIC_KEY) !== null && _v !== void 0 ? _v : "";
exports.PAYSTACK_SECRET_KEY = (_w = process.env.PAYSTACK_SECRET_KEY) !== null && _w !== void 0 ? _w : "";
exports.STARTUP_SUBSCRIPTION = (_x = process.env.STARTUP_SUBSCRIPTION) !== null && _x !== void 0 ? _x : "";
exports.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : ["http://localhost:3000"];
exports.SENTRY_DSN = (_y = process.env.SENTRY_DSN) !== null && _y !== void 0 ? _y : "";
