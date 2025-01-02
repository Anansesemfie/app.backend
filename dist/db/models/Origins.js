"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/helpers"));
const Origins = (Mongoose) => {
    return new Mongoose.Schema({
        name: {
            type: String,
            required: [true, "Origin name is required"],
            unique: [true, "Origin name exist already"],
        },
        flag: {
            type: String,
            unique: [true, "Origin flag should be unique"],
            required: [true, "Origin flag is required"],
        },
        currency: {
            name: String,
            symbol: String,
        },
        active: {
            type: Boolean,
            default: true,
        },
        createdAt: {
            type: Date,
            default: helpers_1.default.currentTime(),
        },
    });
};
exports.default = Origins;
