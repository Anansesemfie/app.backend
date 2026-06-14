import { Report } from "../models";
import { ReportType } from "../../dto";

class ReportRepository {
  public async create(report: ReportType): Promise<ReportType> {
    const newReport = await Report.create(report);
    return newReport;
  }

  public async fetchReports(
    { skip = 0, limit = 20 }: { skip?: number; limit?: number } = {}
  ): Promise<any[]> {
    return Report.find()
      .populate("commentID", "comment")
      .populate("reporter", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  public async countReports(): Promise<number> {
    return Report.countDocuments();
  }

  public async updateStatus(
    id: string,
    status: "pending" | "reviewed" | "resolved"
  ): Promise<void> {
    await Report.findByIdAndUpdate(id, { status });
  }

  public async findById(id: string): Promise<ReportType | null> {
    return Report.findById(id);
  }
}

export default new ReportRepository();
