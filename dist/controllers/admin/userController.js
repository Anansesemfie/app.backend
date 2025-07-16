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
exports.MakeAssociate = exports.FetchUsers = exports.SendEmail = exports.LoginUser = exports.CreateUser = void 0;
const userService_1 = __importDefault(require("../../services/admin/userService"));
const emailService_1 = __importDefault(require("../../services/emailService"));
const CustomError_1 = require("../../utils/CustomError");
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
