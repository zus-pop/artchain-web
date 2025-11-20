import myAxios from "@/lib/custom-axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UploadPaintingData {
  title: string;
  description?: string;
  file: File;
  contestId: string;
  roundId: string;
  competitorId: string;
}

export function useUploadPainting() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UploadPaintingData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) {
        formData.append("description", data.description);
      }
      formData.append("file", data.file);
      formData.append("contestId", data.contestId);
      formData.append("roundId", data.roundId);
      formData.append("competitorId", data.competitorId);

      const response = await myAxios.post("/paintings/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("Bài thi của bạn đã được gửi thành công!");
      queryClient.invalidateQueries({ queryKey: ["check-uploaded"] });
      router.back();
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
