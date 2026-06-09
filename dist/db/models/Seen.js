"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/helpers"));
const Seen = (Mongoose) => {
    return new Mongoose.Schema({
        bookID: {
            type: Mongoose.Schema.Types.ObjectId,
            required: [true, "Book is required"],
        },
        user: {
            type: Mongoose.Schema.Types.ObjectId,
            required: [true, "User required"],
        },
        seenAt: {
            type: Date,
            default: Date.now,
        },
        playedAt: {
            type: [Date],
            default: [],
        },
        period: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "period",
            required: [true, "Period is required"],
        },
        subscription: {
            type: Mongoose.Schema.Types.ObjectId,
            required: false,
        },
        createdAt: {
            type: Date,
            default: helpers_1.default.currentTime(),
        },
    });
};
exports.default = Seen;
