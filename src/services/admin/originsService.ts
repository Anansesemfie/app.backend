import originsRepository from "../../db/repository/originsRepository";
import sessionService from "../sessionService";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import { ErrorEnum } from "../../utils/error";
import { UsersTypes } from "../../db/models/utils";
import type { OriginType } from "../../dto";

class AdminOriginsService {
  private async assertAdmin(token: string) {
    const { user } = await sessionService.getSession(token);
    if (!user || user.account !== UsersTypes.admin) {
      throw new CustomError(ErrorEnum[403], "Forbidden", ErrorCodes.FORBIDDEN);
    }
  }

  async list(token: string): Promise<OriginType[]> {
    await this.assertAdmin(token);
    return await originsRepository.findAll();
  }

  async getOne(token: string, id: string): Promise<OriginType> {
    await this.assertAdmin(token);
    if (!id) {
      throw new CustomError(ErrorEnum[400], "Origin ID is required", ErrorCodes.BAD_REQUEST);
    }
    const origin = await originsRepository.findById(id);
    if (!origin) {
      throw new CustomError(ErrorEnum[404], "Origin not found", ErrorCodes.NOT_FOUND);
    }
    return origin;
  }

  async create(token: string, data: OriginType): Promise<OriginType> {
    await this.assertAdmin(token);
    if (!data.name || !data.flag) {
      throw new CustomError(
        ErrorEnum[400],
        "Origin name and flag are required",
        ErrorCodes.BAD_REQUEST
      );
    }
    return await originsRepository.create(data);
  }

  async update(token: string, id: string, data: Partial<OriginType>): Promise<OriginType> {
    await this.assertAdmin(token);
    if (!id) {
      throw new CustomError(ErrorEnum[400], "Origin ID is required", ErrorCodes.BAD_REQUEST);
    }
    const updated = await originsRepository.update(id, data);
    if (!updated) {
      throw new CustomError(ErrorEnum[404], "Origin not found", ErrorCodes.NOT_FOUND);
    }
    return updated;
  }

  async toggleActive(token: string, id: string): Promise<OriginType> {
    await this.assertAdmin(token);
    if (!id) {
      throw new CustomError(ErrorEnum[400], "Origin ID is required", ErrorCodes.BAD_REQUEST);
    }
    const origin = await originsRepository.findById(id);
    if (!origin) {
      throw new CustomError(ErrorEnum[404], "Origin not found", ErrorCodes.NOT_FOUND);
    }
    const updated = await originsRepository.update(id, { active: !origin.active });
    return updated!;
  }
}

export default new AdminOriginsService();
