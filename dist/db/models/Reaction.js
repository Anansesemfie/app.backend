"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const helpers_1 = __importDefault(require("../../utils/helpers"));
const Reaction = (Mongoose) => {
    return new Mongoose.Schema({
        bookID: {
            type: bson_1.ObjectId,
            required: [true, "Missing book to react"],
        },
        user: {
            type: bson_1.ObjectId,
            required: [true, "Missing to react to book"],
        },
        action: {
            type: String,
            default: "Like",
        },
        createdAt: {
            type: Date,
            default: helpers_1.default.currentTime(),
        },
        deletedAt: {
            type: String,
        },
    });
};
exports.default = Reaction;
