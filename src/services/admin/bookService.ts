import HELPERS from "../../utils/helpers";
import AWS_S3 from "../../utils/aws-s3";
import { AWS_S3_BUCKET_IMAGES } from "../../utils/env";

class AudioService {
  private logInfo = "";
  private s3 = new AWS_S3(AWS_S3_BUCKET_IMAGES);
  public async uploadAudio(file: any, fileType: string): Promise<object> {
    try {
      const signedUrl = await this.s3.getSignedUrl(file, fileType);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } uploading audio @ ${HELPERS.currentTime()}`;
      return signedUrl;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } uploading audio @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
}

export default new AudioService();
