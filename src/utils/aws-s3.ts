import AWS from "aws-sdk";
import {
  AWS_S3_BUCKET_IMAGES,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
} from "./env";
import errorHandler, { ErrorEnum } from "../utils/error";
class AWS_S3 {
  readonly accessKeyId = AWS_ACCESS_KEY_ID;
  readonly secretAccessKey = AWS_SECRET_ACCESS_KEY;
  readonly region = AWS_REGION;
  readonly expires = 60;

  bucketName: string = AWS_S3_BUCKET_IMAGES;
  private s3: AWS.S3 | null = null;
  constructor(preferedBucket?: string) {
    this.s3 = new AWS.S3({
      signatureVersion: "v4",
      region: this.region,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
    this.bucketName = preferedBucket || this.bucketName;
  }

  async getSignedUrl(
    fileName: string,
    fileType: string
  ): Promise<{ signedURL: string; time: number }> {
    const s3Params = {
      Bucket: this.bucketName,
      Key: fileName,
      Expires: this.expires,
      ContentType: fileType,
      ACL: "public-read",
    };
    if (!this.s3) {
      throw await errorHandler.CustomError(
        ErrorEnum[403],
        "Could not generate signed URL"
      );
    }
    const signedURL = await this.s3?.getSignedUrlPromise("putObject", s3Params);
    return { signedURL, time: this.expires };
  }
}

export default AWS_S3;
