import myAxios from "@/lib/custom-axios";
import { WhoAmI } from "@/types";

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  phone: string;
}

export const updateUserApi = async (id: string, data: UpdateUserRequest): Promise<WhoAmI> => {
  const response = await myAxios.put<WhoAmI>(`/users/${id}`, data);
  return response.data;
};
