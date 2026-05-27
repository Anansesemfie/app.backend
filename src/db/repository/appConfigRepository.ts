import { AppConfig } from "../models";
import type { AppConfigType } from "../../dto";

class AppConfigRepository {
  /**
   * Returns the singleton config document, creating it with defaults if it
   * doesn't exist yet.
   */
  public async get(): Promise<AppConfigType> {
    const config = await AppConfig.findOneAndUpdate(
      {},
      { $setOnInsert: { autoPeriodCreation: true } },
      { upsert: true, new: true }
    );
    return config;
  }

  public async update(data: Partial<AppConfigType>): Promise<AppConfigType> {
    const config = await AppConfig.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return config;
  }
}

export default new AppConfigRepository();
