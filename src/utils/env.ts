import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

export const MONGODB_URI = process.env.MONGODB_URI ?? "";
export const HOST_URI = process.env.HOST_URI ?? "localhost";
export const PORT = process.env.PORT ?? 3000;
export const SERVER_LOG_FILE = process.env.SERVER_LOG_FILE ?? "/logs.log";

export const SECRET_JWT = process.env.SECRET_JWT ?? "";
export const EMAIL_OPERAND =
  process.env.EMAIL_OPERAND ?? "mancuniamoe@mail.com";
export const SENDGRID_KEY = process.env.SENDGRID_KEY ?? "";
export const BASE_URL = process.env.BASE_URL ?? "";
export const APP_BASE_URL = isProduction ? process.env.APP_BASE_URL : "http://localhost:3000";

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID ?? "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY ?? "";
export const AWS_REGION = process.env.AWS_REGION ?? "";
export const AWS_S3_BUCKET_IMAGES = process.env.AWS_S3_BUCKET_IMAGES ?? "";
export const AWS_S3_BUCKET_AUDIO = process.env.AWS_S3_BUCKET_AUDIO ?? "";

