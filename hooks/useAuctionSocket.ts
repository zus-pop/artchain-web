"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import {
  BidPlacedEvent,
  AuctionStatusChangedEvent,
  AuctionRealtimeStatus,
  JoinedAuctionEvent,
} from "@/types/auction";
import { useAuthStore } from "@/store";

const WS_URL =
  (process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
    "https://api.artchain.io.vn") + "/auction";

interface UseAuctionSocketOptions {
  auctionId: string;
  onBidPlaced?: (bid: BidPlacedEvent) => void;
  onStatusChanged?: (event: AuctionStatusChangedEvent) => void;
  onAuctionStatus?: (status: AuctionRealtimeStatus) => void;
  onCeilPriceReached?: (data: any) => void;
}

export function useAuctionSocket({
  auctionId,
  onBidPlaced,
  onStatusChanged,
  onAuctionStatus,
  onCeilPriceReached,
}: UseAuctionSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [serverTimeOffsetMs, setServerTimeOffsetMs] = useState(0);
  const [auctionStatus, setAuctionStatus] =
    useState<AuctionRealtimeStatus | null>(null);
  const { accessToken } = useAuthStore();

  const onBidPlacedRef = useRef(onBidPlaced);
  const onStatusChangedRef = useRef(onStatusChanged);
  const onAuctionStatusRef = useRef(onAuctionStatus);
  const onCeilPriceReachedRef = useRef(onCeilPriceReached);

  useEffect(() => { onBidPlacedRef.current = onBidPlaced; }, [onBidPlaced]);
  useEffect(() => { onStatusChangedRef.current = onStatusChanged; }, [onStatusChanged]);
  useEffect(() => { onAuctionStatusRef.current = onAuctionStatus; }, [onAuctionStatus]);
  useEffect(() => { onCeilPriceReachedRef.current = onCeilPriceReached; }, [onCeilPriceReached]);

  const updateServerTimeOffset = useCallback((serverTime?: string) => {
    if (!serverTime) return;

    const parsed = new Date(serverTime).getTime();
    if (Number.isNaN(parsed)) return;

    setServerTimeOffsetMs(parsed - Date.now());
  }, []);

  const normalizeAuctionStatusPayload = useCallback(
    (payload: unknown): AuctionRealtimeStatus | null => {
      if (!payload || typeof payload !== "object") return null;

      const root = payload as Record<string, unknown>;
      const nestedStatus =
        root.auctionStatus && typeof root.auctionStatus === "object"
          ? (root.auctionStatus as Record<string, unknown>)
          : null;
      const source = nestedStatus ?? root;
      const normalizedAuctionId =
        source.auctionId !== undefined && source.auctionId !== null
          ? source.auctionId
          : Number(auctionId);

      if (normalizedAuctionId === undefined || normalizedAuctionId === null) {
        return null;
      }

      return {
        auctionId: normalizedAuctionId as string | number,
        status:
          source.status !== undefined
            ? (source.status as AuctionRealtimeStatus["status"])
            : undefined,
        serverTime:
          source.serverTime !== undefined
            ? String(source.serverTime)
            : undefined,
        paintings: Array.isArray(source.paintings)
          ? (source.paintings as AuctionRealtimeStatus["paintings"])
          : undefined,
      };
    },
    [auctionId],
  );

  const applyAuctionStatus = useCallback(
    (payload: unknown) => {
      const normalized = normalizeAuctionStatusPayload(payload);
      if (!normalized) return;

      setAuctionStatus(normalized);
      updateServerTimeOffset(normalized.serverTime);
      onAuctionStatusRef.current?.(normalized);
    },
    [normalizeAuctionStatusPayload, updateServerTimeOffset],
  );

  const requestAuctionStatus = useCallback(() => {
    if (!socketRef.current || !auctionId) return;

    const payload = { auctionId: Number(auctionId) };
    socketRef.current.emit("getAuctionStatus", payload);
    socketRef.current.emit("get-auction-status", payload);
  }, [auctionId]);

  useEffect(() => {
    if (!auctionId) return;

    const socket = io(WS_URL, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.onAny((eventName, ...args) => {
      console.log(`[Socket AnyEvent] "${eventName}":`, args);
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("🔌 Socket connected:", socket.id);
      
      const user = useAuthStore.getState().user;
      const joinPayload = { 
        auctionId: Number(auctionId), 
        userId: user?.userId || "anonymous" 
      };

      console.log("📤 Attempting to join auction room:", joinPayload);
      // Try both naming conventions for joining
      socket.emit("join-auction", joinPayload);
      socket.emit("joinAuction", joinPayload);

      // Resync immediately on new connection/reconnect.
      requestAuctionStatus();
    });

    socket.io.on("reconnect", () => {
      requestAuctionStatus();
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setIsConnected(false);
    });

    // Real-time bid event from server
    socket.on("bid-placed", (data: BidPlacedEvent) => {
      console.log("🎨 New bid received (bid-placed):", data);
      onBidPlacedRef.current?.(data);
    });

    socket.on("bidPlaced", (data: BidPlacedEvent) => {
      console.log("🎨 New bid received (bidPlaced):", data);
      onBidPlacedRef.current?.(data);
    });

    socket.on("newBid", (data: any) => {
      console.log("💎 [Socket] newBid event received:", data);
      const mappedData: BidPlacedEvent = {
        bidId: data.bidId || `bid-${Date.now()}`,
        auctionId: String(auctionId),
        auctionPaintingId: String(data.auctionPaintingId),
        userId: data.bidderId || data.currentBidderId,
        userName: data.userName,
        amount: data.bidAmount || data.currentBid,
        createdAt: data.timestamp || new Date().toISOString(),
        currentBid: data.currentBid,
        currentBidderId: data.currentBidderId,
        paintingAuctionEndTime: data.paintingAuctionEndTime
          ? String(data.paintingAuctionEndTime)
          : null,
      };

      onBidPlacedRef.current?.(mappedData);
    });

    // Auction status change  (ACTIVE → ENDED etc.)
    socket.on("auction-status-changed", (data: AuctionStatusChangedEvent) => {
      console.log("🚩 Status changed (auction-status-changed):", data);
      onStatusChangedRef.current?.(data);
    });

    socket.on("auctionStatusChanged", (data: AuctionStatusChangedEvent) => {
      console.log("🚩 Status changed (auctionStatusChanged):", data);
      onStatusChangedRef.current?.(data);
    });

    socket.on("userJoined", (data: any) => {
      console.log("👤 [Socket] userJoined:", data);
      if (data?.participantCount !== undefined) {
        setParticipantCount(data.participantCount);
      }
    });

    socket.on("ceilPriceReached", (data: any) => {
      console.log("🚩 [Socket] ceilPriceReached:", data);
      onCeilPriceReachedRef.current?.(data);
    });

    socket.on("userLeft", (data: any) => {
      console.log("👤 [Socket] userLeft:", data);
      if (data?.participantCount !== undefined) {
        setParticipantCount(data.participantCount);
      }
    });

    socket.on("joinedAuction", (data: any) => {
      console.log("🏠 [Socket] joinedAuction:", data);
      if (data?.participantCount !== undefined) {
        setParticipantCount(data.participantCount);
      }

      applyAuctionStatus(data as JoinedAuctionEvent);

      if (!data?.auctionStatus) {
        requestAuctionStatus();
      }
    });

    socket.on("auctionStatus", (data: unknown) => {
      console.log("📡 [Socket] auctionStatus:", data);
      applyAuctionStatus(data);
    });

    socket.on("auction-status", (data: unknown) => {
      console.log("📡 [Socket] auction-status:", data);
      applyAuctionStatus(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("bid-placed");
      socket.off("bidPlaced");
      socket.off("newBid");
      socket.off("auction-status-changed");
      socket.off("auctionStatusChanged");
      socket.off("ceilPriceReached");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("joinedAuction");
      socket.off("auctionStatus");
      socket.off("auction-status");
      socket.io.off("reconnect");
      socket.disconnect();
    };
  }, [auctionId, accessToken, applyAuctionStatus, requestAuctionStatus]);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return {
    isConnected,
    participantCount,
    serverTimeOffsetMs,
    auctionStatus,
    requestAuctionStatus,
    emit,
    socket: socketRef.current,
  };
}
