import dayjs from "dayjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";

import { ErrorEnum } from "./error";
import CustomError, { ErrorCodes } from "./CustomError";
import { SECRET_JWT, SERVER_LOG_FILE, CAN_LOG } from "./env";
class HELPERS {
  public static readonly Chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" as const;

  public static readonly SessionMaxAge = (months: number = 24) =>
    730 * 60 * 60 * months; //2 years

  public static readonly loggerInfo = {
    success: "#Success",
    info: "#Info",
    error: "#Error",
    warning: "#Warning",
  } as const;

  public static LOG(...arg: any) {
    CAN_LOG && console.log(arg);
  }
  public static currentTime(
    formatBy: string = "YYYY-MM-DD HH:mm:ss"
  ): Date | string {
    if (formatBy) return dayjs().format(formatBy);
    return dayjs().toISOString();
  }

  public static async getFirstAndLastDateOfMonth(): Promise<{
    firstDate: Date;
    lastDate: Date;
  }> {
    try {
      const firstDate = dayjs().startOf("month").toDate();
      const lastDate = dayjs().endOf("month").toDate();
      return { firstDate, lastDate };
    } catch (error) {
      throw new CustomError(
        ErrorEnum[500],
        "Failed to get first and last date of the month",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public static async generateFolderName(name: string): Promise<string> {
    try {
      return name.replace(/\s/g, "-").toLowerCase();
    } catch (error) {
      throw new CustomError(
        ErrorEnum[500],
        "Failed to generate folder name",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public static async logger(
    message: string,
    serviceName?: string
  ): Promise<void> {
    try {
      message = `${
        serviceName ? `-${serviceName.toUpperCase()}-` : ""
      }#${message}\n`;
      let dir = `${__dirname}${SERVER_LOG_FILE}`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.appendFile(dir + "logs.log", message, async (err): Promise<void> => {
        if (err) {
          throw new CustomError(
            ErrorEnum[500],
            `Error Writing File to file: ${dir}`,
            ErrorCodes.INTERNAL_SERVER_ERROR
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
      if (!id) {
        id = HELPERS.genRandCode();
      }
      return jwt.sign({ id }, SECRET_JWT, {
        expiresIn: HELPERS.SessionMaxAge(),
      });
    } catch (error) {
      throw new CustomError(
        ErrorEnum[500],
        "Try again later 🙏🏼",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public static async DECODE_TOKEN(token: string): Promise<string | undefined> {
    if (!token) {
      throw new CustomError(
        ErrorEnum[400],
        "Token is required",
        ErrorCodes.BAD_REQUEST
      );
    }
    const decodedToken: JwtPayload | null = jwt.verify(
      token,
      SECRET_JWT
    ) as JwtPayload | null;

    if (!decodedToken?.id) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid Token",
        ErrorCodes.UNAUTHORIZED
      );
    }

    return decodedToken.id;
  }

  public static genRandCode(size: number = 16): string {
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
      throw new CustomError(
        ErrorEnum[500],
        "Failed to generate random code",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
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
  public static hasSpecialCharacters(text: string): boolean {
    // Define a regular expression pattern to match special characters
    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    // Test if the text contains any special characters
    return specialCharsRegex.test(text);
  }
}

export default HELPERS;
