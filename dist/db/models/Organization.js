"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/helpers"));
const organization = (Mongoose) => {
    return new Mongoose.Schema({
        name: {
            type: String,
            required: [true, "Missing Organization Name"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
        },
        type: {
            type: String,
            enum: ["school", "company", "other"],
            default: "school",
        },
        logo: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: helpers_1.default.currentTime(),
        },
        updatedAt: {
            type: Date,
        },
    }, {
        timestamp: true,
    });
};
exports.default = organization;
