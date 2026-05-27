"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appConfig = (Mongoose) => {
    return new Mongoose.Schema({
        autoPeriodCreation: {
            type: Boolean,
            default: true,
        },
    }, { timestamps: true });
};
exports.default = appConfig;
