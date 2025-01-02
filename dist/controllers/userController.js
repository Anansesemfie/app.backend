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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkSubscription = exports.createSubscription = exports.forgotPassword = exports.resetPassword = exports.LogoutUser = exports.LoginUser = exports.CreateUser = void 0;
const userService_1 = __importDefault(require("../services/userService"));
const error_1 = __importDefault(require("../utils/error"));
const CreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = req.body;
        const newUser = yield userService_1.default.create(user);
        res.status(201).json({ data: newUser });
    }
    catch (error) {
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
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
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.LoginUser = LoginUser;
const LogoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = res.locals.sessionId;
        if (!sessionId)
            throw new Error("User not logged in");
        const fetchedUser = yield userService_1.default.logout(sessionId);
        res.status(200).json({ data: fetchedUser });
    }
    catch (error) {
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
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
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
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
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.forgotPassword = forgotPassword;
const createSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subscription } = req.body;
        const sessionId = res.locals.sessionId;
        console.log({ sessionId, subscription });
        const newSubscription = yield userService_1.default.createSubscription(sessionId, subscription);
        res.status(201).json({ data: newSubscription });
    }
    catch (error) {
        console.log({ error });
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
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
        console.log({ error });
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.linkSubscription = linkSubscription;
