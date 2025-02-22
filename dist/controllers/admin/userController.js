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
exports.SendEmail = exports.LoginUser = exports.CreateUser = void 0;
const userService_1 = __importDefault(require("../../services/admin/userService"));
const emailService_1 = __importDefault(require("../../services/emailService"));
const error_1 = __importDefault(require("../../utils/error"));
const CreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = req.body;
        let sessionId = res.locals.sessionId;
        const newUser = yield userService_1.default.create(user, sessionId);
        res.status(201).json({ data: newUser });
    }
    catch (error) {
        console.log({ error });
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
const SendEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, action } = req.body;
        const emailSent = yield emailService_1.default.sendEmail(email, action);
        res.status(200).json({ data: emailSent });
    }
    catch (error) {
        const { code, message, exMessage } = yield error_1.default.HandleError(error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.message);
        res.status(code).json({ error: message, message: exMessage });
    }
});
exports.SendEmail = SendEmail;
