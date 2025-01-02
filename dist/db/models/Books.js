"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const helpers_1 = __importDefault(require("../../utils/helpers"));
const utils_1 = require("./utils");
const Books = (Mongoose) => {
    return new Mongoose.Schema({
        title: {
            type: String,
            required: [true, "This book needs a title!"],
            maxlength: [50, "This is a very long title"],
        },
        description: {
            type: String,
            required: [true, "Say something to tease your audience"],
            minlength: [10, "Express yourself much more than this"],
            maxlength: [1500, "Do not narrate the whole thing here"],
        },
        status: {
            type: Number,
            required: true,
            default: utils_1.BookStatus.Active,
        },
        snippet: {
            type: String,
        },
        authors: [
            {
                type: String,
                default: "unknown",
            },
        ],
        category: [
            {
                type: bson_1.ObjectId,
                ref: "category",
            },
        ],
        languages: [
            {
                type: bson_1.ObjectId,
                ref: "languages",
            },
        ],
        folder: {
            type: String,
            unique: true,
        },
        cover: {
            type: String,
            default: "/images/user_fire.jpg",
        },
        associates: [{
                type: bson_1.ObjectId,
                ref: 'users'
            }],
        uploader: {
            type: bson_1.ObjectId,
            required: [true, "Missing uploader"],
        },
        createdAt: {
            type: Date,
            default: helpers_1.default.currentTime() || Date.now,
        },
        meta: {
            played: {
                type: Number,
                default: 0,
            },
            views: {
                type: Number,
                default: 0,
            },
            comments: {
                type: Number,
                default: 0,
            },
        },
    }, {
        timestamps: true,
    });
};
exports.default = Books;
