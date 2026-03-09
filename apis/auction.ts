import myAxios from "@/lib/custom-axios";
import {
  Auction,
  CreateAuctionRequest,
  AddPaintingToAuctionRequest,
  PlaceBidRequest,
  Bid,
} from "@/types/auction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ─── GET /auctions ───────────────────────────────────────────────────────────
export function useGetAuctions() {
  return useQuery<Auction[]>({
    queryKey: ["auctions"],
    queryFn: async () => {
      const res = await myAxios.get("/auctions");
      return res.data;
    },
    staleTime: 30 * 1000, // 30 seconds (auctions change fast)
    refetchOnWindowFocus: true,
  });
}

// ─── GET /auctions/:auctionId ────────────────────────────────────────────────
export function useGetAuctionById(auctionId?: string) {
  return useQuery<Auction>({
    queryKey: ["auction", auctionId],
    queryFn: async () => {
      const res = await myAxios.get(`/auctions/${auctionId}`);
      return res.data;
    },
    enabled: !!auctionId,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
  });
}

// ─── POST /auctions ───────────────────────────────────────────────────────────
export function useCreateAuction() {
  const queryClient = useQueryClient();
  return useMutation<Auction, Error, CreateAuctionRequest>({
    mutationFn: async (data) => {
      const res = await myAxios.post("/auctions", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Tạo phiên đấu giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Tạo phiên đấu giá thất bại");
    },
  });
}

// ─── POST /auctions/:auctionId/paintings ─────────────────────────────────────
export function useAddPaintingToAuction(auctionId: string) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, AddPaintingToAuctionRequest>({
    mutationFn: async (data) => {
      const res = await myAxios.post(`/auctions/${auctionId}/paintings`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Thêm tranh thành công!");
      queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Thêm tranh thất bại");
    },
  });
}

// ─── POST /auctions/:auctionId/join ──────────────────────────────────────────
export function useJoinAuction(auctionId: string) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, void>({
    mutationFn: async () => {
      const res = await myAxios.post(`/auctions/${auctionId}/join`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Bạn đã tham gia phiên đấu giá!");
      queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Tham gia thất bại");
    },
  });
}

// ─── POST /auctions/bids ──────────────────────────────────────────────────────
export function usePlaceBid() {
  const queryClient = useQueryClient();
  return useMutation<Bid, Error, PlaceBidRequest>({
    mutationFn: async (data) => {
      const res = await myAxios.post("/auctions/bids", data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Đặt giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["auction", variables.auctionId] });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Đặt giá thất bại");
    },
  });
}
