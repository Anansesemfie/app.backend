import OrgRepo from '../db/repository/organizationRepository';
import type { OrganizationType, OrganizationResponseType } from "../dto";
import { ErrorEnum } from "../utils/error";
import CustomError, { ErrorCodes } from "../utils/CustomError";

class OrganizationService {
  public async create(organization: OrganizationType): Promise<OrganizationResponseType> {
      await this.checkPayload(organization);
      const createdOrganization = await OrgRepo.create(organization);
      return this.formatOrganization(createdOrganization);
    
  }

  public async fetchOne(orgId: string): Promise<OrganizationResponseType> {
      if (!orgId) {
        throw new CustomError(
          ErrorEnum[400],
          "Organization ID is required",
          ErrorCodes.BAD_REQUEST
        );
      }
    
      const fetchedOrganization = await OrgRepo.fetchOne(orgId);
      return this.formatOrganization(fetchedOrganization);
    
  }

  public async update(
    orgId: string,
    organization: Partial<OrganizationType>
  ): Promise<OrganizationResponseType> {
      if (!orgId) {
        throw new CustomError(
          ErrorEnum[400],
          "Organization ID is required",
          ErrorCodes.BAD_REQUEST
        );
      }
      await this.checkPayload(organization as OrganizationType);
      const updatedOrganization = await OrgRepo.update(orgId, organization);
      return this.formatOrganization(updatedOrganization);
  }

  public async fetchAll(): Promise<OrganizationResponseType[]> {

      const fetchedOrganizations = await OrgRepo.fetchAll();
      return fetchedOrganizations.map(this.formatOrganization);

  }

  private async checkPayload (organization: OrganizationType) {
    if (!organization.name || !organization.type) {
      throw new CustomError(
        ErrorEnum[400],
        "Organization name and type are required",
        ErrorCodes.BAD_REQUEST
      );
    }
  if (organization.type && !['company', 'school', 'government'].includes(organization.type)) {
      throw new CustomError(
        ErrorEnum[400],
        "Organization type must be one of 'company', 'school', or 'government'",
        ErrorCodes.BAD_REQUEST
      );
    }
  }
  private formatOrganization(org: OrganizationType): OrganizationResponseType {
    return {
        id: org?._id ?? '',
        name: org.name,
        description: org.description,
        type: org.type,
        logo: org.logo ?? '',
    }
  }
}

export default new OrganizationService();