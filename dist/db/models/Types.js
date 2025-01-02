"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types = (Mongoose) => {
    return new Mongoose.Schema({
        title: {
            type: String,
            required: [true, "Types Title missing"]
        },
        desc: {
            type: String
        }
    }, {
        timestamps: true,
    });
};
exports.default = Types;
