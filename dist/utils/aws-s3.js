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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const env_1 = require("./env");
const error_1 = __importStar(require("../utils/error"));
class AWS_S3 {
    constructor(preferedBucket) {
        this.accessKeyId = env_1.AWS_ACCESS_KEY_ID;
        this.secretAccessKey = env_1.AWS_SECRET_ACCESS_KEY;
        this.region = env_1.AWS_REGION;
        this.expires = 60;
        this.bucketName = env_1.AWS_S3_BUCKET_IMAGES;
        this.s3 = null;
        this.s3 = new aws_sdk_1.default.S3({
            signatureVersion: "v4",
            region: this.region,
            accessKeyId: this.accessKeyId,
            secretAccessKey: this.secretAccessKey,
        });
        this.bucketName = preferedBucket || this.bucketName;
    }
    getSignedUrl(fileName, fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const s3Params = {
                Bucket: this.bucketName,
                Key: fileName,
                Expires: this.expires,
                ContentType: fileType,
                ACL: "public-read",
            };
            if (!this.s3) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Could not generate signed URL");
            }
            const signedURL = yield ((_a = this.s3) === null || _a === void 0 ? void 0 : _a.getSignedUrlPromise("putObject", s3Params));
            return { signedURL, time: this.expires };
        });
    }
}
exports.default = AWS_S3;
