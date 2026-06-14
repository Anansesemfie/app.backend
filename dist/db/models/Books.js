"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
            maxlength: [5000, "Do not narrate the whole thing here"],
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
                type: Mongoose.Schema.Types.ObjectId,
                ref: "authors",
            },
        ],
        narrators: [
            {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "narrators",
            },
        ],
        category: [
            {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "categories",
            },
        ],
        genres: [
            {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "genres",
            },
        ],
        languages: [
            {
                type: Mongoose.Schema.Types.ObjectId,
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
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }],
        uploader: {
            type: Mongoose.Schema.Types.ObjectId,
            required: [true, "Missing uploader"],
        },
        organization: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "organization",
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
            likes: {
                type: Number,
                default: 0,
            },
            dislikes: {
                type: Number,
                default: 0,
            },
        },
    }, {
        timestamps: true,
    });
};
exports.default = Books;
