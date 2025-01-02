"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const helpers_1 = __importDefault(require("../../utils/helpers"));
const Subscribers = (Mongoose) => {
    return new Mongoose.Schema({
        //active and inactive subscriptions
        parent: {
            type: bson_1.ObjectId,
            required: [true, "missing subscription key"],
        },
        user: {
            type: bson_1.ObjectId,
            required: [true, "missing user ID"],
        },
        status: {
            type: String,
            default: "Active",
        },
        active: {
            type: Boolean,
            default: true,
        },
        books: [
            {
                type: bson_1.ObjectId,
                ref: "books",
            },
        ],
        ref: {
            type: String,
            required: [true, "Reference ID is required"],
            unique: [true, "Reference ID exist already"],
        },
        createdAt: {
            type: Date,
            default: helpers_1.default.currentTime(),
        },
        updatedAt: {
            type: Date,
        },
        activatedAt: {
            type: Date,
        },
        deactivatedAt: {
            type: Date,
        },
    }, {
        timestamp: true,
    });
};
exports.default = Subscribers;
