"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const helpers_1 = __importDefault(require("../../utils/helpers"));
const chapters = (Mongoose) => {
    return new Mongoose.Schema({
        title: {
            type: String,
            default: "A chapter without name",
        },
        description: {
            type: String,
        },
        file: {
            type: String,
        },
        mimetype: {
            type: String,
        },
        book: {
            type: bson_1.ObjectId,
            required: [true, "Missing Book"],
        },
        createdAt: {
            type: Date,
            default: helpers_1.default.currentTime(),
        },
    }, {
        timestamp: true,
    });
};
exports.default = chapters;
