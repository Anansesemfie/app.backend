import chapterService from "./chapterService";
import booksService from "./booksService";
import seenService from "./seenService";
import userService from "./userService";

import HELPERS from "../utils/helpers";

class PlayService {
  private logInfo = "";
  async unAuthorizedUserPlay(chapterId: string, userId: string = "") {
    try {
      console.log("unauthorized", chapterId);
      const chapter = await chapterService.fetchChapter(chapterId);
      if (chapter?.title?.toLowerCase() === "sample") return chapter;

      const book = await booksService.fetchBook(chapter?.book);
      const chapters = await chapterService.fetchChapters(book?._id as string);
      const chapterToReturn =
        chapters.find((chapter) => chapter.title?.toLowerCase() === "sample") ??
        chapters[0];
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } unauthorized user played chapter: ${
        chapterToReturn?._id
      } @ ${HELPERS.currentTime()}`;
      console.log({ book });
      return {
        ...chapterToReturn,
        playTime: chapterToReturn?.title.toLowerCase() === "sample" ? 1 : 0.25,
        status: userId ? "No Active subscription" : "Not logged in",
      };
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching books @ ${HELPERS.currentTime()}`;
      throw new Error(error);
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
  async authorizedUserPlay(chapterId: string, userId: string) {
    try {
      console.log("authorized", chapterId);
      const user = await userService.fetchUser(userId);
      if (!user?.subscription)
        return this.unAuthorizedUserPlay(chapterId, user?._id);
      const chapter = await chapterService.fetchChapter(chapterId);
      await seenService.updateSeen(chapter?.book, userId, {
        played: true,
        subscription: user?.subscription,
      });
      return {
        ...chapter,
        playTime: 1,
      };
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching books @ ${HELPERS.currentTime()}`;
      throw new Error(error);
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
}
export default new PlayService();
