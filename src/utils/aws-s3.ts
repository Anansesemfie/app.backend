import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  AWS_S3_BUCKET_IMAGES,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
} from "./env";
import errorHandler, { ErrorEnum } from "../utils/error";

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

    try {
      const signedURL = await getSignedUrl(
        this.s3,
        new PutObjectCommand(s3Params),
        { expiresIn: this.expires }
      );
      return { signedURL, time: this.expires };
    } catch (error) {
      console.log({error})
      throw await errorHandler.CustomError(
        ErrorEnum[500],
        "Could not generate signed URL"
      );
    }
  }
}

export default AWS_S3;
