import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import ErrorHandler, { ErrorEnum } from "./error.js";
import { SECRET_JWT, SERVER_LOG_FILE } from "./env.js";
const errorHandler = new ErrorHandler();
class HELPERS {
  public static readonly Chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  public static readonly SessionMaxAge = (months: number = 24) =>
    730 * 60 * 60 * months; //2 years

  public static readonly loggerInfo = {
    success: "#Success",
    info: "#Info",
    error: "#Error",
    warning: "#Warning",
  } as const;
  public static currentTime(): string {
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  }

  public static async logger(
    message: string,
    file: string = "logs.log"
  ): Promise<void> {
    try {
      message = "#" + message + "\n";
      let dir = `${__dirname}${SERVER_LOG_FILE}`;
      console.log("log_file", dir);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.appendFile(dir + file, message, async (err): Promise<void> => {
        if (err) {
          console.log("Error", err);
          throw await errorHandler.CustomError(
            ErrorEnum[500],
            `Error Writing File to file: ${file}`
          );
        }
      });
    } catch (error) {
      console.log("Error logger", error);
      throw error;
    }
  }

  //JSON web Token

  public static async ENCODE_Token(id: string = ""): Promise<string> {
    try {
      if (!id) id = await HELPERS.genRandCode();
      return await jwt.sign({ id }, SECRET_JWT, {
        expiresIn: HELPERS.SessionMaxAge(),
      });
    } catch (error) {
      throw await errorHandler.CustomError(
        ErrorEnum[500],
        "Try again later 🙏🏼"
      );
    }
  }

  public static async DECODE_TOKEN(token: string): Promise<string> {
    //check token
    if (token) {
      let back: string = "";

      try {
        await jwt.verify(token, SECRET_JWT, (err, decodedToken) => {
          if (err) {
            errorHandler.CustomError(ErrorEnum[403], "Invalid Token");
          } else {
            back = decodedToken.id;
          }
        });

        return back;
      } catch (error: any) {
        throw error;
      }
    }
  }

  public static async GET_DIRECTORY(
    file: string,
    dir: string = __dirname
  ): Promise<string> {
    try {
      let directory = path.join(dir, file);

      return directory;
    } catch (error) {
      throw await errorHandler.CustomError(ErrorEnum[500], "Try again later");
    }
  }

  public static async genRandCode(size: number = 16): Promise<string> {
    try {
      let result = "";
      for (let i = 0; i < size; i++) {
        result += HELPERS.Chars.charAt(
          Math.floor(Math.random() * HELPERS.Chars.length)
        );
      }
      if (result.length < size) throw new Error(ErrorEnum[500]);
      return result;
    } catch (error) {
      throw await errorHandler.CustomError(ErrorEnum[500], "Try again later");
    }
  }

  public static FILE_DETAILS(file) {
    try {
      let ext = path.extname(file.name);
      return { extension: ext };
    } catch (error) {}
  }
}

export default HELPERS;
