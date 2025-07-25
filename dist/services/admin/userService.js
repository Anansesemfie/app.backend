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
const userService_1 = __importDefault(require("../userService"));
const userRepository_1 = __importDefault(require("../../db/repository/userRepository"));
const error_1 = require("../../utils/error");
const CustomError_1 = __importStar(require("../../utils/CustomError"));
const helpers_1 = __importDefault(require("../../utils/helpers"));
const sessionService_1 = __importDefault(require("../sessionService"));
const utils_1 = require("../../db/models/utils");
class AdminUserService {
    constructor() {
        this.logInfo = "";
    }
    create(user, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield sessionService_1.default.getSession(sessionId);
            if (session.user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Unauthorized to create user", CustomError_1.ErrorCodes.UNAUTHORIZED);
            }
            return yield userService_1.default.create(user);
        });
    }
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const userRecord = yield userRepository_1.default.fetchOneByEmail(email);
            helpers_1.default.LOG({ userRecord });
            if ((userRecord === null || userRecord === void 0 ? void 0 : userRecord.account) !== utils_1.UsersTypes.admin &&
                (userRecord === null || userRecord === void 0 ? void 0 : userRecord.account) !== utils_1.UsersTypes.associate) {
                throw new CustomError_1.default(error_1.ErrorEnum[404], "User not found or unauthorized", CustomError_1.ErrorCodes.NOT_FOUND);
            }
            return yield userService_1.default.login({ email, password });
        });
    }
    fetchUsers(params, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {
                email: { $regex: params.search },
            };
            const session = yield sessionService_1.default.getSession(sessionId);
            if (session.user.account !== utils_1.UsersTypes.admin) {
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Unauthorized to fetch users", CustomError_1.ErrorCodes.UNAUTHORIZED);
            }
            const users = yield userRepository_1.default.fetchAll(filter);
            return Promise.all(users.map((user) => {
                return userService_1.default.formatUser(user);
            }));
        });
    }
    changeRole(userId, userType, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield sessionService_1.default.getSession(sessionId);
            if (session.user.account !== utils_1.UsersTypes.admin)
                throw new CustomError_1.default(error_1.ErrorEnum[403], "Unauthorized to change user role", CustomError_1.ErrorCodes.UNAUTHORIZED);
            const user = yield userService_1.default.updateUser({ account: userType }, userId);
            return yield userService_1.default.formatUser(user);
        });
    }
}
exports.default = new AdminUserService();
