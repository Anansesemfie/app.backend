"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Languages = (Mongoose) => {
    return new Mongoose.Schema({
        title: {
            type: String,
            required: [true, "Language Title missing"],
            unique: [true, "Language name is required"],
            lowercase: false,
        },
        active: {
            type: Boolean,
            default: true,
        },
    }, {
        timestamp: true,
    });
};
exports.default = Languages;
