import appConfigRepository from "../../db/repository/appConfigRepository";
import type { AppConfigType, AppConfigResponseType } from "../../dto";

class AppConfigService {
  public async get(): Promise<AppConfigResponseType> {
    const config = await appConfigRepository.get();
    return this.format(config);
  }

  public async update(
    data: Partial<AppConfigType>
  ): Promise<AppConfigResponseType> {
    const config = await appConfigRepository.update(data);
    return this.format(config);
  }

  /**
   * Used by the cron job to check the flag without going through HTTP.
   */
  public async isAutoPeriodCreationEnabled(): Promise<boolean> {
    const config = await appConfigRepository.get();
    return config.autoPeriodCreation;
  }

  private format(config: AppConfigType): AppConfigResponseType {
    return {
      id: config._id ?? "",
      autoPeriodCreation: config.autoPeriodCreation,
      createdAt: config.createdAt ?? new Date(),
      updatedAt: config.updatedAt ?? new Date(),
    };
  }
}

export default new AppConfigService();
