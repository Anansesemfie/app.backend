"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const helpers_1 = __importDefault(require("../../utils/helpers"));
const validator_1 = require("validator");
const utils_1 = require("./utils");
const Users = (Mongoose) => {
    const USER = new Mongoose.Schema({
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email is unique"],
            lowercase: true,
            validate: [validator_1.isEmail, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Minimum password length is 6 characters"],
            validate: [validator_1.isStrongPassword, "Password not Strong enough"],
        },
        username: {
            type: String,
            lowercase: true,
            minlength: [2, "Username is too short.."],
            required: [true, "username is required"],
        },
        account: {
            type: Number,
            default: utils_1.UsersTypes.User,
        },
        active: {
            type: Boolean,
            default: false,
        },
        dp: {
            type: String,
            default: "/images/dp.png",
        },
        bio: {
            type: String,
            required: false,
            default: "This user is secretive",
        },
        key: {
            type: String,
            require: false,
        },
        subscription: {
            type: bson_1.ObjectId,
            required: false,
        },
        createdAt: {
            type: Date,
            default: helpers_1.default.currentTime() || Date.now,
        },
    });
    return USER;
};
exports.default = Users;
