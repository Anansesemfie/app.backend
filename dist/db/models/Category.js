"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Category = (Mongoose) => {
    return new Mongoose.Schema({
        title: {
            type: String,
            required: [true, "Category Title missing"],
            unique: [true, "Category name is required"],
            lowercase: false,
        },
        active: {
            type: Boolean,
            required: true,
            default: false,
        },
    }, {
        timestamps: true,
    });
};
exports.default = Category;
