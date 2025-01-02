"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/helpers"));
const bson_1 = require("bson");
const Subscriptions = (Mongoose) => {
    return new Mongoose.Schema({
        name: {
            type: String,
            unique: true,
            required: [true, "Subscription needs a unique name"],
        },
        active: {
            type: Boolean,
            default: false,
        },
        visible: {
            type: Boolean,
            default: false,
        },
        duration: {
            type: Number,
            default: "2592000000",
        },
        users: {
            type: Number,
            min: 1,
            default: 1,
        },
        autorenew: {
            type: Boolean,
            default: false,
        },
        amount: {
            type: Number,
            min: 0,
            required: [true, "Subscription amount is missing"],
        },
        origin: {
            type: bson_1.ObjectId,
            required: [true, "Subscription origin is missing"],
        },
        accent: {
            type: String,
            default: "#fff",
        },
        isNew: {
            type: Boolean,
            default: true,
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
exports.default = Subscriptions;
