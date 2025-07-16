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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const organizationRepository_1 = __importDefault(require("../db/repository/organizationRepository"));
const error_1 = require("../utils/error");
const CustomError_1 = __importStar(require("../utils/CustomError"));
class OrganizationService {
    create(organization) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkPayload(organization);
            const createdOrganization = yield organizationRepository_1.default.create(organization);
            return this.formatOrganization(createdOrganization);
        });
    }
    fetchOne(orgId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!orgId) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Organization ID is required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            const fetchedOrganization = yield organizationRepository_1.default.fetchOne(orgId);
            return this.formatOrganization(fetchedOrganization);
        });
    }
    update(orgId, organization) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!orgId) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Organization ID is required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            yield this.checkPayload(organization);
            const updatedOrganization = yield organizationRepository_1.default.update(orgId, organization);
            return this.formatOrganization(updatedOrganization);
        });
    }
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchedOrganizations = yield organizationRepository_1.default.fetchAll();
            return fetchedOrganizations.map(this.formatOrganization);
        });
    }
    checkPayload(organization) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!organization.name || !organization.type) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Organization name and type are required", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
            if (organization.type && !['company', 'school', 'government'].includes(organization.type)) {
                throw new CustomError_1.default(error_1.ErrorEnum[400], "Organization type must be one of 'company', 'school', or 'government'", CustomError_1.ErrorCodes.BAD_REQUEST);
            }
        });
    }
    formatOrganization(org) {
        var _a, _b;
        return {
            id: (_a = org === null || org === void 0 ? void 0 : org._id) !== null && _a !== void 0 ? _a : '',
            name: org.name,
            description: org.description,
            type: org.type,
            logo: (_b = org.logo) !== null && _b !== void 0 ? _b : '',
        };
    }
}
exports.default = new OrganizationService();
