import chapterService from "../../services/admin/chapterService";
import { Request, Response } from "express";

import errorHandler from "../../utils/error";

export const CreateChapter = async (req: Request, res: Response) => {
  try {
    const chapter = req.body;
    const token = res.locals.sessionId;
    const createdChapter = await chapterService.CreateChapter(chapter, token);
    res.status(200).json({ data: createdChapter });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const GetSignedUrl = async (req: Request, res: Response) => {
  try {
    const { file, fileType } = req.body;
    const token = res.locals.sessionId;
    console.log({ file, fileType, token });
    const signedUrl = await chapterService.getAWSURL(file, fileType, token);
    res.status(200).json({ data: signedUrl });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};
