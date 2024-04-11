import dayjs from "dayjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";

import errorHandler, { ErrorEnum } from "./error";
import { SECRET_JWT, SERVER_LOG_FILE } from "./env";
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

  public static async logger(message: string): Promise<void> {
    try {
      message = "#" + message + "\n";
      let dir = `${__dirname}${SERVER_LOG_FILE}`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.appendFile(dir + "logs.log", message, async (err): Promise<void> => {
        if (err) {
          throw await errorHandler.CustomError(
            ErrorEnum[500],
            `Error Writing File to file: ${dir}`
          );
        }
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //JSON web Token

  public static async ENCODE_Token(id: string = ""): Promise<string> {
    try {
      if (!id) id = await HELPERS.genRandCode();
      return jwt.sign({ id }, SECRET_JWT, {
        expiresIn: HELPERS.SessionMaxAge(),
      });
    } catch (error) {
      throw await errorHandler.CustomError(
        ErrorEnum[500],
        "Try again later 🙏🏼"
      );
    }
  }

  public static async DECODE_TOKEN(token: string): Promise<string | undefined> {
    try {
      if (token) {
        const decodedToken: JwtPayload | null = jwt.verify(
          token,
          SECRET_JWT
        ) as JwtPayload | null;

        if (decodedToken?.id) {
          return decodedToken.id;
        } else {
          errorHandler.CustomError(ErrorEnum[403], "Invalid Token Data");
          // If the token is invalid or lacks required properties, throw an error
          throw new Error("Invalid Token Data");
        }
      }

      return;
    } catch (error: any) {
      throw error;
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

  public static FILE_DETAILS(file: { name: string }) {
    try {
      let ext = path.extname(file.name);
      return { extension: ext };
    } catch (error) {}
  }

  public static millisecondsToDays(milliseconds: number): number {
    // There are 86,400,000 milliseconds in a day
    const millisecondsInDay: number = 24 * 60 * 60 * 1000;

    // Calculate days by dividing milliseconds by milliseconds in a day
    const days: number = milliseconds / millisecondsInDay;

    return days;
  }

  public static countDaysBetweenDates(
    dateString1: string,
    dateString2: string
  ): number {
    // Convert date strings to Date objects
    const date1: Date = new Date(dateString1);
    const date2: Date = new Date(dateString2);

    // Convert both dates to UTC to ensure consistent calculation
    const utcDate1: number = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const utcDate2: number = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );

    // Calculate the difference in milliseconds
    const millisecondsDifference: number = Math.abs(utcDate2 - utcDate1);

    // Convert milliseconds to days
    const daysDifference: number =
      millisecondsDifference / (1000 * 60 * 60 * 24);

    return Math.floor(daysDifference);
  }
}

export default HELPERS;