"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/helpers"));
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
            type: String,
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
        books: [
            {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "books",
            },
        ],
        origin: {
            type: Mongoose.Schema.Types.ObjectId,
            required: false,
            set: (v) => (v === "" ? undefined : v),
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
