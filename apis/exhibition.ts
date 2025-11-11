import myAxios from "@/lib/custom-axios";
import {
  AddPaintingToExhibitionRequest,
  ApiResponse,
  CreateExhibitionRequest,
  DeletePaintingToExhibitionRequest,
  Exhibition,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useCreateExhibition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (createExhibitionRequest: CreateExhibitionRequest) => {
      const response = await myAxios.post(
        "/exhibitions",
        createExhibitionRequest
      );
      return response;
    },
    onSuccess: () => {
      toast.success("Tạo triễn lãm thành công");
      queryClient.invalidateQueries({ queryKey: ["exhibition"] });
    },
    onError: (error) => {
      let message = error.message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      }
      toast.error(message);
    },
  });
}

export function useUpdateExhibition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      createExhibitionRequest: Partial<CreateExhibitionRequest> & {
        exhibitionId: string;
      }
    ) => {
      const { exhibitionId, ...data } = createExhibitionRequest;
      const response = await myAxios.put(`/exhibitions/${exhibitionId}`, data);
      return response;
    },
    onSuccess: () => {
      toast.success("Cập nhật triễn lãm thành công");
      queryClient.invalidateQueries({ queryKey: ["exhibition"] });
    },
    onError: (error) => {
      let message = error.message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      }
      toast.error(message);
    },
  });
}

export function useDeleteExhibition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exhibitionId: string) => {
      const response = await myAxios.delete(`/exhibitions/${exhibitionId}`);
      return response;
    },
    onSuccess: () => {
      toast.success("Xoá triễn lãm thành công");
      queryClient.invalidateQueries({ queryKey: ["exhibition"] });
    },
    onError: (error) => {
      let message = error.message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      }
      toast.error(message);
    },
  });
}

export function useAddPaintingToExhibition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      addPaintingToExhibitionRequest: AddPaintingToExhibitionRequest
    ) => {
      const { exhibitionId, ...data } = addPaintingToExhibitionRequest;

      const response = await myAxios.post(
        `exhibitions/${exhibitionId}/paintings`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Thêm tranh vào triễn lãm thành công");
      queryClient.invalidateQueries({ queryKey: ["exhibition"] });
    },
    onError: (error) => {
      let message = error.message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      }
      toast.error(message);
    },
  });
}

export function useDeletePaintingToExhibition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      deletePaintingToExhibitionRequest: DeletePaintingToExhibitionRequest
    ) => {
      const { exhibitionId, paintingId } = deletePaintingToExhibitionRequest;

      const response = await myAxios.delete(
        `exhibitions/${exhibitionId}/paintings/${paintingId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Gỡ tranh khỏi triễn lãm thành công");
      queryClient.invalidateQueries({ queryKey: ["exhibition"] });
    },
    onError: (error) => {
      let message = error.message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message;
      }
      toast.error(message);
    },
  });
}

export function useGetExhibitions() {
  return useQuery({
    queryKey: ["exhibition"],
    queryFn: async () => {
      const response = await myAxios.get<ApiResponse<Exhibition[]>>(
        "/exhibitions"
      );
      return response.data;
    },
  });
}

export function useGetExhibitionById(id: string) {
  return useQuery({
    queryKey: ["exhibition", id],
    queryFn: async () => {
      const response = await myAxios.get<ApiResponse<Exhibition>>(
        `/exhibitions/${id}`
      );
      return response.data;
    },
  });
}
