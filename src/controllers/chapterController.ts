import chapterService from "../services/chapterService";
import { Request, Response } from "express";

export const getChapters = async (req: Request, res: Response) => {
  try {
    const chapters = await chapterService.fetchChapters(req.params.bookId);
    res.status(200).json(chapters);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getChapter = async (req: Request, res: Response) => {
  try {
    const chapter = await chapterService.fetchChapter(req.params.chapterId);
    res.status(200).json(chapter);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
