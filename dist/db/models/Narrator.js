"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Narrator = (Mongoose) => {
    return new Mongoose.Schema({
        name: {
            type: String,
            required: [true, "Narrator name missing"],
            unique: [true, "Narrator name must be unique"],
            lowercase: false,
        },
        active: {
            type: Boolean,
            default: true,
        },
        bio: {
            type: String,
        },
    }, {
        timestamps: true,
    });
};
exports.default = Narrator;
