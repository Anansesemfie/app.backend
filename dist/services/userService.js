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
exports.UserService = void 0;
const userRepository_1 = __importDefault(require("../db/repository/userRepository"));
const subscribersService_1 = __importDefault(require("./subscribersService"));
const error_1 = __importStar(require("../utils/error"));
const env_1 = require("../utils/env");
const helpers_1 = __importDefault(require("../utils/helpers"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sessionService_1 = __importDefault(require("./sessionService"));
const emailService_1 = __importDefault(require("./emailService"));
class UserService {
    constructor() {
        this.logInfo = null;
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!user.email || !user.username || !user.password)
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Invalid user data");
                const salt = yield bcrypt_1.default.genSalt();
                user.password = yield bcrypt_1.default.hash(user.password, salt);
                const newUser = yield userRepository_1.default.create(user);
                const verificationCode = yield this.generateVerification(newUser._id);
                const { subscription } = yield subscribersService_1.default.create(env_1.STARTUP_SUBSCRIPTION, newUser);
                yield this.updateUser({ subscription: subscription._id }, newUser._id);
                const HTML = `Hello <b>${newUser.username}</b>, <br/>verify your account <br/>
      <b>code:${verificationCode}</b> <br/>
      and <a href="${env_1.APP_BASE_URL}">goto app </a> or
      `;
                yield emailService_1.default.sendEmail({
                    to: newUser.email,
                    subject: "Verify Account",
                    html: HTML,
                }, {
                    actions: [
                        {
                            link: `${env_1.APP_BASE_URL}/callback/verify?verificationCode=${verificationCode}`,
                            title: "Verify Account",
                        },
                    ],
                    header: "New Account Verification",
                    body: "Verify your account to start using our services",
                });
                return newUser;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} creating ${user.username} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = null;
            }
        });
    }
    updateUser(payload, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = (yield userRepository_1.default.update(payload, userID));
                this.logInfo = `
      ${helpers_1.default.loggerInfo.success} updating user ${userID} @ ${helpers_1.default.currentTime()}
      `;
                return updatedUser;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} updating user ${userID} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = null;
            }
        });
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchedUser = yield userRepository_1.default.Login(user === null || user === void 0 ? void 0 : user.email);
                if (!fetchedUser || !fetchedUser.active) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid user or credentials");
                }
                const isPasswordValid = yield bcrypt_1.default.compare(user === null || user === void 0 ? void 0 : user.password, fetchedUser.password);
                this.logInfo = `${helpers_1.default.loggerInfo.success} logging in ${user.email} @ ${helpers_1.default.currentTime()}`;
                if (!isPasswordValid) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid user credentials");
                }
                return yield this.formatForReturn(fetchedUser);
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} logging in ${user.email} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = null;
            }
        });
    }
    logout(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield sessionService_1.default.endSession(sessionId);
                this.logInfo = `${helpers_1.default.loggerInfo.success} ended session: ${sessionId} @ ${helpers_1.default.currentTime()}`;
                return session;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} ended session: ${sessionId} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    fetchUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchedUser = yield userRepository_1.default.fetchUser(userId);
                this.logInfo = `${helpers_1.default.loggerInfo.success} fetching user ${userId} @ ${helpers_1.default.currentTime()}`;
                return fetchedUser;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} fetching user ${userId} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    formatForReturn(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield sessionService_1.default.create(user === null || user === void 0 ? void 0 : user._id, {
                    duration: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
                    external: false,
                });
                return {
                    email: user.email,
                    username: user.username,
                    dp: user.dp,
                    bio: user.bio,
                    token: yield helpers_1.default.ENCODE_Token(token === null || token === void 0 ? void 0 : token._id),
                    role: user.account,
                    subscription: {
                        active: !!user.subscription,
                        id: user.subscription ? user.subscription.toString() : "",
                    },
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const code = yield helpers_1.default.DECODE_TOKEN(token);
                helpers_1.default.LOG(code);
                const user = yield userRepository_1.default.fetchOneByKey(code !== null && code !== void 0 ? code : "");
                if (!user) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Invalid user data");
                }
                const salt = yield bcrypt_1.default.genSalt();
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
                yield this.updateUser({ password: hashedPassword, active: true }, user._id);
                this.logInfo = `${helpers_1.default.loggerInfo.success} resetting password for user with token ${token} @ ${helpers_1.default.currentTime()}`;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} resetting password for user with token ${token} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                this.logInfo = `${helpers_1.default.loggerInfo.error} resetting password for user with token ${token} @ ${helpers_1.default.currentTime()}`;
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    requestPasswordReset(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userRepository_1.default.fetchOneByEmail(email);
                if (!user) {
                    throw new Error("User not found");
                }
                const token = yield this.generatePasswordResetToken(user);
                const encryptedToken = yield helpers_1.default.ENCODE_Token(token);
                yield emailService_1.default.sendEmail({
                    to: user.email,
                    subject: "Password Reset",
                    html: `Hello ${user.username}, reset your password <a href="${env_1.APP_BASE_URL}/reset-password?token=${token}">here</a>`,
                }, {
                    header: "Password Reset",
                    body: "Reset your password",
                    actions: [
                        {
                            title: "Reset Password",
                            link: `${env_1.APP_BASE_URL}/callback/resetPassword?token=${encryptedToken}&email=${user.email}`,
                        },
                    ],
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    createSubscription(sessionId, subscriptionParentID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield sessionService_1.default.getSession(sessionId);
                const curUser = (yield userRepository_1.default.fetchUser(session.user._id));
                //create child subscription
                const { paymentDetails, subscription } = yield subscribersService_1.default.create(subscriptionParentID, curUser);
                if (!subscription) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[500], "Error creating subscription");
                }
                this.updateUser({ subscription: subscription._id }, curUser._id);
                this.logInfo = `
      ${helpers_1.default.loggerInfo.success} creating subscription for user ${curUser.username} @ ${helpers_1.default.currentTime()}
      `;
                return paymentDetails;
            }
            catch (error) {
                this.logInfo = `
      ${helpers_1.default.loggerInfo.error} creating subscription for user with session ID ${sessionId} @ ${helpers_1.default.currentTime()}
      `;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = null;
            }
        });
    }
    linkSubscription(sessionId, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = yield sessionService_1.default.getSession(sessionId);
                const subscription = yield subscribersService_1.default.fetchOne({ ref });
                //create child subscription
                const payload = {
                    subscription: subscription._id,
                };
                const newSubscription = yield this.updateUser(payload, user._id);
                this.logInfo = `
      ${helpers_1.default.loggerInfo.success} linking subscription for user ${user.username} @ ${helpers_1.default.currentTime()}
      `;
                return newSubscription;
            }
            catch (error) {
                this.logInfo = `
      ${helpers_1.default.loggerInfo.error} linking subscription for user with session ID ${sessionId} @ ${helpers_1.default.currentTime()}
      `;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = null;
            }
        });
    }
    generatePasswordResetToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = helpers_1.default.genRandCode();
            yield this.updateUser({ key: token }, user._id);
            return token;
        });
    }
    generateVerification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = helpers_1.default.genRandCode();
                yield userRepository_1.default.update({
                    key: token,
                }, userId);
                this.logInfo = `${helpers_1.default.loggerInfo.success} creating verification code for useerId: ${userId} @ ${helpers_1.default.currentTime()}`;
                return helpers_1.default.ENCODE_Token(token);
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} creating verification code for user ${userId} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    verifyAccount(verificationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                helpers_1.default.LOG(verificationCode);
                if (!verificationCode)
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[400], "Invalid verification code");
                const code = yield helpers_1.default.DECODE_TOKEN(verificationCode);
                const user = yield userRepository_1.default.fetchOneByKey(code !== null && code !== void 0 ? code : "");
                if (!user) {
                    throw yield error_1.default.CustomError(error_1.ErrorEnum[404], "User not found or already verified");
                }
                yield this.updateUser({ active: true }, user._id);
                this.logInfo = `${helpers_1.default.loggerInfo.success} verifying account for user ${user.username} @ ${helpers_1.default.currentTime()}`;
                return user;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} verifying account for user with verification code ${verificationCode} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
    formatUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formattedUser = {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    account: user.account,
                    active: user.active,
                    dp: user.dp,
                    bio: user.bio,
                    subscription: user.subscription,
                    createdAt: user.createdAt,
                };
                this.logInfo = `${helpers_1.default.loggerInfo.success} formatting user ${user.username} @ ${helpers_1.default.currentTime()}`;
                return formattedUser;
            }
            catch (error) {
                this.logInfo = `${helpers_1.default.loggerInfo.error} formatting user ${user.username} @ ${helpers_1.default.currentTime()}`;
                throw error;
            }
            finally {
                yield helpers_1.default.logger(this.logInfo);
                this.logInfo = "";
            }
        });
    }
}
exports.UserService = UserService;
exports.default = new UserService();
