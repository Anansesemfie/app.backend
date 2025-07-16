import chapterService from "./chapterService";
import booksService from "./booksService";
import seenService from "./seenService";
import sessionService from "./sessionService";
import subscribersService from "./subscribersService";

import HELPERS from "../utils/helpers";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { ErrorEnum } from "../utils/error";

class PlayService {
  private logInfo = "";
  async play(chapterId: string, sessionId: string) {
    if (!chapterId) {
      throw new CustomError(
        ErrorEnum[400],
        "Chapter required are required",
        ErrorCodes.BAD_REQUEST
      );
    }
    if (!sessionId) {
      return await this.unAuthorizedUserPlay(chapterId);
    }
    return await this.authorizedUserPlay(chapterId, sessionId);
  }
  async unAuthorizedUserPlay(chapterId: string, userId = "") {
    const chapter = await chapterService.fetchChapter(chapterId);
    if (chapter?.title?.toLowerCase() === "sample") return chapter;
    const book = await booksService.fetchBook(chapter?.book?.id ?? "");
    const chapters = await chapterService.fetchChapters(book?.id as string);
    const chapterToReturn =
      chapters.find((chapter) => chapter.title?.toLowerCase() === "sample") ??
      chapters[0];
    return {
      chapter: chapterToReturn,
      playTime: chapterToReturn?.title.toLowerCase() === "sample" ? 1 : 0.25,
      status: userId ? "No Active subscription" : "Not logged in",
    };
  }
  async authorizedUserPlay(chapterId: string, sessionId: string) {
    const { user } = await sessionService.getSession(sessionId);
    if (!user.subscription) {
      return await this.unAuthorizedUserPlay(chapterId, user._id); // If user has no subscription, return unauthorized play
    }
    const subscription = await subscribersService.validateSubscription(
      user.subscription
    );

    if (!subscription) {
      return await this.unAuthorizedUserPlay(chapterId, user._id); // If subscription is invalid, return unauthorized play
    }
    const chapter = await chapterService.fetchChapter(chapterId);
    await seenService.recordPlay(
      chapter?.book?.id || "",
      user._id as string,
      HELPERS.currentTime(),
      user?.subscription
    );

    return {
      chapter,
      playTime: 1,
    };
  }
}
export default new PlayService();
