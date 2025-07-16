"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const error_1 = require("../../utils/error");
const CustomError_1 = __importStar(require("../../utils/CustomError"));
class OrganizationRepository {
    create(organization) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                return yield models_1.Organization.create(organization);
            }
            catch (error) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error creating organization", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    fetchOne(organizationNameOrId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const fetchedOrganization = yield models_1.Organization.findOne({
                    $or: [{ _id: organizationNameOrId }, { name: organizationNameOrId }],
                });
                return fetchedOrganization;
            }
            catch (error) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error fetching organization", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    update(organizationId, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const updatedOrganization = yield models_1.Organization.findOneAndUpdate({ _id: organizationId }, organization, { new: true });
                return updatedOrganization;
            }
            catch (error) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error updating organization", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const fetchedOrganizations = yield models_1.Organization.find();
                return fetchedOrganizations;
            }
            catch (error) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error fetching organizations", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    delete(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield models_1.Organization.findByIdAndDelete(organizationId);
            }
            catch (error) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], (_a = error.message) !== null && _a !== void 0 ? _a : "Error deleting organization", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
}
exports.default = new OrganizationRepository();
