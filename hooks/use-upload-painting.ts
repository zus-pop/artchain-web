import myAxios from "@/lib/custom-axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UploadPaintingData {
  title: string;
  description?: string;
  file: File;
  contestId: string;
  roundId: string;
  competitorId: string;
  ignoreAiCheck: boolean;
}

export function useUploadPainting() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation({
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
      formData.append("ignoreAiCheck", data.ignoreAiCheck.toString());
      const response = await myAxios.post("/paintings/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("Bài thi đã gửi thành công.");
      queryClient.invalidateQueries({ queryKey: ["check-uploaded"] });
      router.back();
    },
    onError: (error) => {
      let message = error.message;
      if (error instanceof AxiosError) {
        message = error.response?.data.message || message;
      }
      setErrorMessage(message);
      setErrorModalOpen(true);
    },
  });

  return { ...mutation, errorModalOpen, setErrorModalOpen, errorMessage };
}
