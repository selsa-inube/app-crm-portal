import { IOption } from "@inubekit/inubekit";

import { IRemunerationProfile } from "@services/catalogs/getRemunerationProfiles";

export const mapProfilesToOptions = (profiles: IRemunerationProfile[]): IOption[] => {
  return profiles.map((profile) => ({
    id: profile.remunerationProfileId,
    label: profile.remunerationProfileName,
    value: profile.remunerationProfileId,
    description: profile.remunerationProfileDescription,
  }));
};
