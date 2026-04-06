import myAxios from "@/lib/custom-axios";
import {
  Auction,
  AuctionPainting,
  WonPainting,
  AuctionListQuery,
  CreateAuctionRequest,
  AddPaintingToAuctionRequest,
  PlaceBidRequest,
  Bid,
} from "@/types/auction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ─── GET /auctions ───────────────────────────────────────────────────────────
export function useGetAuctions(params?: AuctionListQuery) {
  return useQuery<Auction[]>({
    queryKey: ["auctions", params ?? {}],
    queryFn: async () => {
      const res = await myAxios.get("/auctions", { params });
      // Check if response has data.data (wrapped in ApiResponse) or is raw Auction[]
      return res.data?.data ?? res.data ?? [];
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
export function useJoinAuction(auctionId: string | number) {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, void>({
    mutationFn: async () => {
      const res = await myAxios.post(`/auctions/${auctionId}/join`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Bạn đã tham gia phiên đấu giá!");
      queryClient.invalidateQueries({ queryKey: ["auction", String(auctionId)] });
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
    onSuccess: () => {
      toast.success("Đặt giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["auction"] });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Đặt giá thất bại");
    },
  });
}
// ─── PATCH /auctions/:auctionId/status ──────────────────────────────────────
export function useUpdateAuctionStatus() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { auctionId: string | number; status: string }>({
    mutationFn: async ({ auctionId, status }) => {
      const res = await myAxios.patch(`/auctions/${auctionId}/status`, { status });
      return res.data;
    },
    onSuccess: (_, { auctionId }) => {
      toast.success("Cập nhật trạng thái thành công!");
      queryClient.invalidateQueries({ queryKey: ["auction", String(auctionId)] });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Cập nhật trạng thái thất bại");
    },
  });
}

// ─── PATCH /auctions/:auctionId/end ─────────────────────────────────────────
export function useEndAuction() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: async (auctionId: string) => {
      const res = await myAxios.patch(`/auctions/${auctionId}/end`);
      return res.data;
    },
    onSuccess: (_, auctionId) => {
      toast.success("Kết thúc phiên đấu giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Kết thúc phiên đấu giá thất bại");
    },
  });
}
// ─── GET /auctions/users/:userId/won-paintings ──────────────────────────
export function useGetWonPaintings(userId?: string) {
  return useQuery<WonPainting[]>({
    queryKey: ["won-paintings", userId],
    queryFn: async () => {
      const res = await myAxios.get(`/auctions/users/${userId}/won-paintings`);
      return res.data?.data ?? res.data ?? [];
    },
    enabled: !!userId,
    staleTime: 60 * 1000,
  });
}

// ─── GET /auctions/:auctionId/:paintingId/bid-history ────────────────
export function useGetBidHistory(auctionId: string | number, paintingId: string) {
  return useQuery<Bid[]>({
    queryKey: ["bid-history", auctionId, paintingId],
    queryFn: async () => {
      const res = await myAxios.get(`/auctions/${auctionId}/${paintingId}/bid-history`);
      // Map API response to Bid[] if needed. 
      // The sample shows: { data: [ { bidHistoryId, bidAmount, bidTime, bidder: { fullName } } ] }
      const rawData = res.data?.data || res.data || [];
      return rawData.map((item: any) => ({
        bidId: String(item.bidHistoryId),
        auctionId: String(auctionId),
        auctionPaintingId: String(item.auctionPaintingId),
        userId: item.bidderId,
        userName: item.bidder?.fullName || item.bidder?.username,
        amount: item.bidAmount,
        createdAt: item.bidTime,
      }));
    },
    enabled: !!auctionId && !!paintingId,
    staleTime: 5 * 1000, // Frequent updates
  });
}
