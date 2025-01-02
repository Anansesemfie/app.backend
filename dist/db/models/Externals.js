"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/helpers"));
const validator_1 = require("validator");
const Externals = (Mongoose) => {
    return new Mongoose.Schema({
        email: {
            type: String,
            required: false,
            validate: [validator_1.isEmail, "Please enter a valid email"],
        },
        phone: {
            type: String,
            required: false,
        },
        active: {
            type: Boolean,
            required: false,
            default: true,
        },
        createdAt: {
            type: Date,
            default: helpers_1.default.currentTime(),
        },
    });
};
exports.default = Externals;
