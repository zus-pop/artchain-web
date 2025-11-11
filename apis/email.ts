import myAxios from "@/lib/custom-axios";
import { AnnounceWinnersRequest, MultipleEmailsRequest } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useSendMultipleEmails() {
  return useMutation({
    mutationFn: async (multipleEmailsRequest: MultipleEmailsRequest) => {
      const response = await myAxios.post("/emails", multipleEmailsRequest);
      return response.data;
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

export function useNotifyContest() {
  return useMutation({
    mutationFn: async () => {
      const response = await myAxios.post("/emails/notify-contest");
      return response.data;
    },
    // onError: (error) => {
    //   let message = error.message;
    //   if (error instanceof AxiosError) {
    //     message = error.response?.data.message;
    //   }
    //   toast.error(message);
    // },
  });
}

export function useAnnounceWinners() {
  return useMutation({
    mutationFn: async (announceWinnersRequest: AnnounceWinnersRequest) => {
      const response = await myAxios.post(
        "/emails/announce-winners",
        announceWinnersRequest
      );
      return response.data;
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
