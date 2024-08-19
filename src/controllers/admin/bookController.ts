import bookService from "../../services/admin/bookService";
import { Request, Response } from "express";

import errorHandler from "../../utils/error";

export const GenerateSignedUrl = async (req: Request, res: Response) => {
  try {
    let { file, fileType } = req.body;
    const signedUrl = await bookService.uploadAudio(file, fileType);
    res.status(200).json({data:signedUrl});
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
}