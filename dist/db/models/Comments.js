"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __importDefault(require("../../utils/helpers"));
const Comments = (Mongoose) => {
    return new Mongoose.Schema({
        bookID: {
            type: Mongoose.Schema.Types.ObjectId,
            required: [true, "Missing book to comment on"],
        },
        user: {
            type: Mongoose.Schema.Types.ObjectId,
            required: [true, "Missing user to comment on book"],
        },
        comment: {
            type: String,
            required: [true, "Comment is empty"],
            maxlength: [100, "Comment too long"],
        },
        period: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "period",
            required: [true, "Period is required"],
        },
        parentId: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "BookComments",
            required: false,
            default: null,
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
exports.default = Comments;
