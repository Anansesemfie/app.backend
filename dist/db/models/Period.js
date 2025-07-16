"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/helpers"));
const period = (Mongoose) => {
    return new Mongoose.Schema({
        year: {
            type: Number,
            required: [true, "Missing Year"],
        },
        month: {
            type: Number,
            required: [true, "Missing Month"],
        },
        startDate: {
            type: Date,
            required: [true, "Missing Start Date"],
        },
        endDate: {
            type: Date,
            required: [true, "Missing End Date"],
        },
        active: {
            type: Boolean,
            default: true,
        },
        createdAt: {
            type: Date,
            default: helpers_1.default.currentTime(),
        },
    }, {
        timestamp: true,
    });
};
exports.default = period;
