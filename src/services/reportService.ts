import reportRepository from "../db/repository/reportRepository";
import sessionService from "./sessionService";
import { ReportResponseType, ReportType } from "../dto";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { ErrorEnum } from "../utils/error";

class ReportService {
  public async reportComment({
    commentID,
    sessionID,
    reason,
  }: {
    commentID: string;
    sessionID: string;
    reason: string;
  }) {
    if (!commentID || !sessionID || !reason) {
      throw new CustomError(
        ErrorEnum[400],
        "Comment ID, session and reason are required",
        ErrorCodes.BAD_REQUEST
      );
    }

    const { session } = await sessionService.getSession(sessionID);
    
    const newReport = await reportRepository.create({
      commentID,
      reporter: session?.user as string,
      reason,
      status: "pending",
    });

    return newReport;
  }

  public async getReports({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) {
    const skip = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      reportRepository.fetchReports({ skip, limit }),
      reportRepository.countReports(),
    ]);

    const results: ReportResponseType[] = reports.map((r: any) => ({
      id: String(r._id),
      comment: {
        id: String(r.commentID?._id),
        text: r.commentID?.comment ?? "[Deleted]",
      },
      reporter: {
        id: String(r.reporter?._id),
        username: r.reporter?.username ?? "Anonymous",
      },
      reason: r.reason,
      status: r.status,
      createdAt: String(r.createdAt),
    }));

    return {
      page,
      limit,
      total,
      results,
    };
  }

  public async updateReportStatus(id: string, status: "pending" | "reviewed" | "resolved") {
    const report = await reportRepository.findById(id);
    if (!report) {
      throw new CustomError(ErrorEnum[404], "Report not found", ErrorCodes.NOT_FOUND);
    }
    await reportRepository.updateStatus(id, status);
  }
}

export default new ReportService();
