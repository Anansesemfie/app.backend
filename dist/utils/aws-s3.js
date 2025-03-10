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
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const env_1 = require("./env");
const error_1 = __importStar(require("../utils/error"));
class AWS_S3 {
    constructor(preferedBucket) {
        this.accessKeyId = env_1.AWS_ACCESS_KEY_ID;
        this.secretAccessKey = env_1.AWS_SECRET_ACCESS_KEY;
        this.region = env_1.AWS_REGION;
        this.expires = 60;
        this.s3 = new client_s3_1.S3({
            region: this.region,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            },
        });
        this.bucketName = preferedBucket || env_1.AWS_S3_BUCKET_IMAGES;
    }
    getSignedUrl(fileName, fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            const s3Params = {
                Bucket: this.bucketName,
                Key: fileName,
                ContentType: fileType,
            };
            try {
                const signedURL = yield (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.PutObjectCommand(s3Params), { expiresIn: this.expires });
                return { signedURL, time: this.expires };
            }
            catch (error) {
                throw yield error_1.default.CustomError(error_1.ErrorEnum[403], "Could not generate signed URL");
            }
        });
    }
}
exports.default = AWS_S3;
