import { S3, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  AWS_S3_BUCKET_IMAGES,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
} from "./env";
import  { ErrorEnum } from "../utils/error";
import CustomError from "./CustomError";

class AWS_S3 {
  private readonly accessKeyId = AWS_ACCESS_KEY_ID;
  private readonly secretAccessKey = AWS_SECRET_ACCESS_KEY;
  private readonly region = AWS_REGION;
  private readonly expires = 60;

  private bucketName: string;
  private s3: S3;

  constructor(preferedBucket?: string) {
    this.s3 = new S3({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });

    this.bucketName = preferedBucket || AWS_S3_BUCKET_IMAGES;
  }

  async getSignedUrl(
    fileName: string,
    fileType: string
  ): Promise<{ signedURL: string; time: number }> {
    const s3Params = {
      Bucket: this.bucketName,
      Key: fileName,
      ContentType: fileType,
    };
    const signedURL = await getSignedUrl(
      this.s3,
      new PutObjectCommand(s3Params),
      { expiresIn: this.expires }
    );
    if (!signedURL) {
      throw new CustomError(
        "Unknown error",
        "Could not generate signed URL",
        400
      );
    }
    return { signedURL, time: this.expires };
  }

  async deleteObject(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );
  }
}

export default AWS_S3;
