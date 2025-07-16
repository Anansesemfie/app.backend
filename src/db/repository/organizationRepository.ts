import { Organization } from "../models";
import { OrganizationType } from "../../dto";
import { ErrorEnum } from "../../utils/error";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
class OrganizationRepository {
  public async create(
    organization: OrganizationType
  ): Promise<OrganizationType> {
    try {
      return await Organization.create(organization);
    } catch (error) {
      throw new CustomError(ErrorEnum[400], 
        (error as Error).message ?? "Error creating organization",
         ErrorCodes.BAD_REQUEST);
    }
  }

  public async fetchOne(
    organizationNameOrId: string
  ): Promise<OrganizationType> {
    try {
      const fetchedOrganization = await Organization.findOne({
        $or: [{ _id: organizationNameOrId }, { name: organizationNameOrId }],
      });
      return fetchedOrganization;
    } catch (error) {
      throw new CustomError(ErrorEnum[400],
        (error as Error).message ?? "Error fetching organization",
        ErrorCodes.BAD_REQUEST
      );
    }
  }
  public async update(
    organizationId: string,
    organization: Partial<OrganizationType>
  ): Promise<OrganizationType> {
    try {
      const updatedOrganization = await Organization.findOneAndUpdate(
        { _id: organizationId },
        organization,
        { new: true }
      );
      return updatedOrganization;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error updating organization",
        ErrorCodes.BAD_REQUEST
      );
    }
  }
  public async fetchAll(): Promise<OrganizationType[]> {
    try {
      const fetchedOrganizations = await Organization.find();
      return fetchedOrganizations;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching organizations",
        ErrorCodes.BAD_REQUEST
      );
    }
  }
  public async delete(organizationId: string): Promise<void> {
    try {
      await Organization.findByIdAndDelete(organizationId);
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error deleting organization",
        ErrorCodes.BAD_REQUEST
      );
      
    }
  }
}

export default new OrganizationRepository();
