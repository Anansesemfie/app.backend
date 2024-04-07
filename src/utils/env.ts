import "dotenv/config";

export const MONGODB_URI = process.env.MONGODB_URI ?? "";
export const HOST_URI = process.env.HOST_URI ?? "localhost";
export const PORT = process.env.PORT ?? 3000;
export const SERVER_LOG_FILE = process.env.SERVER_LOG_FILE ?? "/logs.log";

export const SECRET_JWT = process.env.SECRET_JWT ?? "";
export const EMAIL_OPERAND =
  process.env.EMAIL_OPERAND ?? "mancuniamoe@mail.com";
