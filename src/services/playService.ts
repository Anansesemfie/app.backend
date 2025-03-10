import chapterService from "./chapterService";
import booksService from "./booksService";
import seenService from "./seenService";
import sessionService from "./sessionService";
import subscribersService from "./subscribersService";

import HELPERS from "../utils/helpers";

class PlayService {
  private logInfo = "";
  async unAuthorizedUserPlay(chapterId: string, userId: string = "") {
    try {
      const chapter = await chapterService.fetchChapter(chapterId);
      if (chapter?.title?.toLowerCase() === "sample") return chapter;
      const book = await booksService.fetchBook(chapter?.book?._id ?? "");
      const chapters = await chapterService.fetchChapters(book?._id as string);
      const chapterToReturn =
        chapters.find((chapter) => chapter.title?.toLowerCase() === "sample") ??
        chapters[0];
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } unauthorized user played chapter: ${
        chapterToReturn?.id
      } @ ${HELPERS.currentTime()}`;
      return {
        chapter: chapterToReturn,
        playTime: chapterToReturn?.title.toLowerCase() === "sample" ? 1 : 0.25,
        status: userId ? "No Active subscription" : "Not logged in",
      };
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching books @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
  async authorizedUserPlay(chapterId: string, sessionId: string) {
    try {
      const { user } = await sessionService.getSession(sessionId);
      if (!user.subscription)
        return await this.unAuthorizedUserPlay(chapterId, user._id);
      const subscription = await subscribersService.validateSubscription(
        user.subscription
      );

      if (!subscription){
        return await this.unAuthorizedUserPlay(chapterId, user._id);
      }
      const chapter = await chapterService.fetchChapter(chapterId);
      await seenService.updateSeen(
        chapter?.book?._id || "",
        user._id as string,
        {
          playedAt: HELPERS.currentTime(),
          subscription: user?.subscription,
        }
      );

      this.logInfo = `${HELPERS.loggerInfo.success} authorized user played chapter: ${chapter?.id}`;
      return {
        chapter,
        playTime: 1,
      };
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching books @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
}
export default new PlayService();
