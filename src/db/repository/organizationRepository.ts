import { Organization } from "../models";
import { OrganizationType } from "../../dto";
import errHandler, { ErrorEnum } from "../../utils/error";

class OrganizationRepository {
  public async create(
    organization: OrganizationType
  ): Promise<OrganizationType> {
    try {
      return await Organization.create(organization);
    } catch (error: any) {
      throw await errHandler.CustomError(ErrorEnum[400], error._message);
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
    } catch (error: any) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error fetching organization"
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
    } catch (error: any) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error updating organization"
      );
    }
  }
  public async fetchAll(): Promise<OrganizationType[]> {
    try {
      const fetchedOrganizations = await Organization.find();
      return fetchedOrganizations;
    } catch (error: any) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error fetching organizations"
      );
    }
  }
  public async delete(organizationId: string): Promise<void> {
    try {
      await Organization.findByIdAndDelete(organizationId);
    } catch (error: any) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error deleting organization"
      );
    }
  }
}

export default new OrganizationRepository();
