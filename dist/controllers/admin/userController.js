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
exports.FetchUser = exports.MakeAssociate = exports.FetchUsers = exports.SendEmail = exports.LoginUser = exports.CreateUser = void 0;
const userService_1 = __importDefault(require("../../services/admin/userService"));
const userService_2 = __importDefault(require("../../services/userService"));
const emailService_1 = __importDefault(require("../../services/emailService"));
const userRepository_1 = __importDefault(require("../../db/repository/userRepository"));
const utils_1 = require("../../db/models/utils");
const CustomError_1 = __importStar(require("../../utils/CustomError"));
const CreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = req.body;
        let sessionId = res.locals.sessionId;
        const newUser = yield userService_1.default.create(user, sessionId);
        res.status(201).json({ data: newUser });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.CreateUser = CreateUser;
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.sessionId)
            res.status(401).json({ message: "Already logged in" });
        let user = req === null || req === void 0 ? void 0 : req.body;
        const fetchedUser = yield userService_1.default.login(user);
        res.status(200).json({ data: fetchedUser });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.LoginUser = LoginUser;
const SendEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, body } = req.body;
        const emailSent = yield emailService_1.default.sendEmail(email, body);
        res.status(200).json({ data: emailSent });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.SendEmail = SendEmail;
const FetchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, account } = req.body;
        const sessionId = res.locals.sessionId;
        const users = yield userService_1.default.fetchUsers({ search, account }, sessionId);
        res.status(200).json({ data: users });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.FetchUsers = FetchUsers;
const MakeAssociate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, type } = req.body;
        const sessionId = res.locals.sessionId;
        const user = yield userService_1.default.changeRole(userId, type, sessionId);
        res.status(200).json({ data: user });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.MakeAssociate = MakeAssociate;
const FetchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = res.locals.sessionId;
        const { user: sessionUser } = yield (yield Promise.resolve().then(() => __importStar(require("../../services/sessionService")))).default.getSession(sessionId);
        if (!sessionUser || sessionUser.account !== utils_1.UsersTypes.admin) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const userId = req.params.id;
        const user = yield userRepository_1.default.fetchUser(userId);
        if (!user) {
            throw new CustomError_1.default("User not found", "User not found", CustomError_1.ErrorCodes.NOT_FOUND);
        }
        const formatted = yield userService_2.default.formatUser(user);
        res.status(200).json({ data: formatted });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.FetchUser = FetchUser;
