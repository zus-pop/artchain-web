import myAxios from "@/lib/custom-axios";
import { SponsorResponse, CreateSponsorRequest } from "@/types/campaign";

/**
 * Public Sponsor APIs
 */

// POST /api/sponsors - Create a new sponsor
export const createSponsor = async (data: CreateSponsorRequest): Promise<SponsorResponse> => {
  const formData = new FormData();

  // Add text fields
  formData.append('name', data.name);
  formData.append('contactInfo', data.contactInfo);
  formData.append('sponsorshipAmount', data.sponsorshipAmount.toString());
  formData.append('campaignId', data.campaignId.toString());

  // Add file if provided
  if (data.file) {
    formData.append('file', data.file);
  }

  const response = await myAxios.post("/sponsors", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};