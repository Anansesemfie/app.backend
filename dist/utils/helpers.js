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
const dayjs_1 = __importDefault(require("dayjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const error_1 = __importStar(require("./error"));
const env_1 = require("./env");
class HELPERS {
    static LOG(...arg) {
        env_1.CAN_LOG && console.log(arg);
    }
    static currentTime(formatBy = "YYYY-MM-DD HH:mm:ss") {
        if (formatBy)
            return (0, dayjs_1.default)().format(formatBy);
        return (0, dayjs_1.default)().toISOString();
    }
    static generateFolderName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return name.replace(/\s/g, "-").toLowerCase();
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[500], "Try again later");
            }
        });
    }
    static logger(message, serviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                message = `${serviceName ? `-${serviceName.toUpperCase()}-` : ""}#${message}\n`;
                let dir = `${__dirname}${env_1.SERVER_LOG_FILE}`;
                if (!fs_1.default.existsSync(dir)) {
                    fs_1.default.mkdirSync(dir);
                }
                fs_1.default.appendFile(dir + "logs.log", message, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        throw yield error_1.default.CustomError(error_1.ErrorEnum[500], `Error Writing File to file: ${dir}`);
                    }
                }));
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    //JSON web Token
    static ENCODE_Token() {
        return __awaiter(this, arguments, void 0, function* (id = "") {
            try {
                if (!id)
                    id = HELPERS.genRandCode();
                return jsonwebtoken_1.default.sign({ id }, env_1.SECRET_JWT, {
                    expiresIn: HELPERS.SessionMaxAge(),
                });
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[500], "Try again later 🙏🏼");
            }
        });
    }
    static DECODE_TOKEN(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (token) {
                    const decodedToken = jsonwebtoken_1.default.verify(token, env_1.SECRET_JWT);
                    if (decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id) {
                        return decodedToken.id;
                    }
                    else {
                        error_1.default.CustomError(error_1.ErrorEnum[403], "Invalid Token Data");
                        // If the token is invalid or lacks required properties, throw an error
                        throw new Error("Invalid Token Data");
                    }
                }
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static GET_DIRECTORY(file_1) {
        return __awaiter(this, arguments, void 0, function* (file, dir = __dirname) {
            try {
                let directory = path_1.default.join(dir, file);
                return directory;
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[500], "Try again later");
            }
        });
    }
    static genRandCode(size = 16) {
        try {
            let result = "";
            for (let i = 0; i < size; i++) {
                result += HELPERS.Chars.charAt(Math.floor(Math.random() * HELPERS.Chars.length));
            }
            if (result.length < size)
                throw new Error(error_1.ErrorEnum[500]);
            return result;
        }
        catch (error) {
            throw error_1.default.CustomError(error_1.ErrorEnum[500], "Try again later");
        }
    }
    static FILE_DETAILS(file) {
        try {
            let ext = path_1.default.extname(file.name);
            return { extension: ext };
        }
        catch (error) { }
    }
    static millisecondsToDays(milliseconds) {
        // There are 86,400,000 milliseconds in a day
        const millisecondsInDay = 24 * 60 * 60 * 1000;
        // Calculate days by dividing milliseconds by milliseconds in a day
        const days = milliseconds / millisecondsInDay;
        return days;
    }
    static countDaysBetweenDates(dateString1, dateString2) {
        // Convert date strings to Date objects
        const date1 = new Date(dateString1);
        const date2 = new Date(dateString2);
        // Convert both dates to UTC to ensure consistent calculation
        const utcDate1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        const utcDate2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
        // Calculate the difference in milliseconds
        const millisecondsDifference = Math.abs(utcDate2 - utcDate1);
        // Convert milliseconds to days
        const daysDifference = millisecondsDifference / (1000 * 60 * 60 * 24);
        return Math.floor(daysDifference);
    }
    static hasSpecialCharacters(text) {
        // Define a regular expression pattern to match special characters
        const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        // Test if the text contains any special characters
        return specialCharsRegex.test(text);
    }
}
HELPERS.Chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
HELPERS.SessionMaxAge = (months = 24) => 730 * 60 * 60 * months; //2 years
HELPERS.loggerInfo = {
    success: "#Success",
    info: "#Info",
    error: "#Error",
    warning: "#Warning",
};
exports.default = HELPERS;
