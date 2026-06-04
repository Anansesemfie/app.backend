"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Quote = (Mongoose) => {
    return new Mongoose.Schema({
        quote: {
            type: String,
            required: [true, "A quote is required"],
        },
        author: {
            type: String,
            default: "Unknown",
        },
        active: {
            type: Boolean,
            default: true,
        },
    }, {
        timestamps: true,
    });
};
exports.default = Quote;
