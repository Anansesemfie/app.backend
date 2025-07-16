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
exports.verifyAccount = exports.linkSubscription = exports.createSubscription = exports.forgotPassword = exports.resetPassword = exports.LogoutUser = exports.LoginUser = exports.CreateUser = void 0;
const userService_1 = __importDefault(require("../services/userService"));
const CustomError_1 = __importStar(require("../utils/CustomError"));
const helpers_1 = __importDefault(require("../utils/helpers"));
const CreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = req.body;
        const newUser = yield userService_1.default.create(user);
        res.status(201).json({ data: newUser });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.CreateUser = CreateUser;
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (res.locals.sessionId) {
            throw new CustomError_1.default('User is already logged in', "User is already logged in", CustomError_1.ErrorCodes.FORBIDDEN);
        }
        let user = req === null || req === void 0 ? void 0 : req.body;
        const fetchedUser = yield userService_1.default.login(user);
        res.status(200).json({ data: fetchedUser });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.LoginUser = LoginUser;
const LogoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = res.locals.sessionId;
        helpers_1.default.LOG("Session ID", sessionId);
        if (!sessionId) {
            throw new CustomError_1.default("Unknown action", "Not Found", CustomError_1.ErrorCodes.NOT_FOUND);
        }
        const fetchedUser = yield userService_1.default.logout(sessionId);
        res.status(200).json({ data: fetchedUser });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.LogoutUser = LogoutUser;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, newPassword } = req.body;
        yield userService_1.default.resetPassword(token, newPassword);
        res.status(200).json({ data: { message: "Password reset successful" } });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.resetPassword = resetPassword;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield userService_1.default.requestPasswordReset(email);
        res
            .status(200)
            .json({ data: { message: "Password reset email sent successfully" } });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.forgotPassword = forgotPassword;
const createSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subscription } = req.body;
        const sessionId = res.locals.sessionId;
        const newSubscription = yield userService_1.default.createSubscription(sessionId, subscription);
        res.status(201).json({ data: newSubscription });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.createSubscription = createSubscription;
const linkSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ref } = req.body;
        const sessionId = res.locals.sessionId;
        const newSubscription = yield userService_1.default.linkSubscription(sessionId, ref);
        res.status(201).json({ data: newSubscription });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.linkSubscription = linkSubscription;
const verifyAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        yield userService_1.default.verifyAccount(token);
        res
            .status(200)
            .json({ data: { message: "Account verified successfully" } });
    }
    catch (error) {
        CustomError_1.CustomErrorHandler.handle(error, res);
    }
});
exports.verifyAccount = verifyAccount;
