"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/helpers"));
const Account = (Mongoose) => {
    return new Mongoose.Schema({
        provider: {
            type: String,
            required: [true, "Provider name required"],
        },
        accountName: {
            type: String,
            required: [true, "Name is required"],
        },
        account: {
            type: String,
            required: [true, "Number is required"],
        },
        branch: {
            type: String,
            required: false,
        },
        createdAt: {
            type: Date,
            default: helpers_1.default.currentTime(),
        },
    }, {
        timestamp: true,
    });
};
exports.default = Account;
