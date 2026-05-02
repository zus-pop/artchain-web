import myAxios from "@/lib/custom-axios";

export interface Criteria {
  id: number;
  name: string;
  description: string;
  maxScore: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCriteriaDto {
  name: string;
  description: string;
  maxScore: number;
  isActive: boolean;
}

export interface UpdateCriteriaDto extends Partial<CreateCriteriaDto> {}

export const getCriteria = async (): Promise<Criteria[]> => {
  const response = await myAxios.get("/admin/criteria");
  return response.data?.data || response.data || [];
};

export const getCriteriaById = async (id: number): Promise<Criteria> => {
  const response = await myAxios.get(`/admin/criteria/${id}`);
  return response.data?.data || response.data;
};

export const createCriteria = async (data: CreateCriteriaDto): Promise<Criteria> => {
  const response = await myAxios.post("/admin/criteria", data);
  return response.data?.data || response.data;
};

export const updateCriteria = async (id: number, data: UpdateCriteriaDto): Promise<Criteria> => {
  const response = await myAxios.patch(`/admin/criteria/${id}`, data);
  return response.data?.data || response.data;
};

export const deleteCriteria = async (id: number): Promise<void> => {
  const response = await myAxios.delete(`/admin/criteria/${id}`);
  return response.data?.data || response.data;
};
