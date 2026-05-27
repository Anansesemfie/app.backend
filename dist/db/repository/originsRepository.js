"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
class OriginsRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.Origin.create(data);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.Origin.find({}).select("-__v").lean());
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.Origin.findById(id).select("-__v").lean());
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield models_1.Origin.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
                .select("-__v")
                .lean());
        });
    }
}
exports.default = new OriginsRepository();
