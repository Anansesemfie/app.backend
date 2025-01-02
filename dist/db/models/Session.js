"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const helpers_1 = __importDefault(require("../../utils/helpers"));
const Session = (Mongoose) => {
    const sessions = new Mongoose.Schema({
        user: {
            type: bson_1.ObjectId,
            required: [true, "User is required"],
        },
        duration: {
            type: String,
            default: "2592000000",
        },
        expiredAt: {
            type: Date,
        },
        external: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: helpers_1.default.currentTime(),
        },
    });
    return sessions;
};
exports.default = Session;
