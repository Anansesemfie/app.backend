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
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const env_1 = require("./env");
const CustomError_1 = __importDefault(require("./CustomError"));
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
            const signedURL = yield (0, s3_request_presigner_1.getSignedUrl)(this.s3, new client_s3_1.PutObjectCommand(s3Params), { expiresIn: this.expires });
            if (!signedURL) {
                throw new CustomError_1.default("Unknown error", "Could not generate signed URL", 400);
            }
            return { signedURL, time: this.expires };
        });
    }
    deleteObject(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.s3.send(new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            }));
        });
    }
}
exports.default = AWS_S3;
