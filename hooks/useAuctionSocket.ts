"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { BidPlacedEvent, AuctionStatusChangedEvent } from "@/types/auction";
import { useAuthStore } from "@/store";

const WS_URL =
  (process.env.NEXT_PUBLIC_SOCKET_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
    "https://api.artchain.io.vn") + "/auction";

interface UseAuctionSocketOptions {
  auctionId: string;
  onBidPlaced?: (bid: BidPlacedEvent) => void;
  onStatusChanged?: (event: AuctionStatusChangedEvent) => void;
}

export function useAuctionSocket({
  auctionId,
  onBidPlaced,
  onStatusChanged,
}: UseAuctionSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const { accessToken } = useAuthStore();

  // Stable callbacks via ref to avoid re-subscribing on every render
  const onBidPlacedRef = useRef(onBidPlaced);
  const onStatusChangedRef = useRef(onStatusChanged);
  useEffect(() => { onBidPlacedRef.current = onBidPlaced; }, [onBidPlaced]);
  useEffect(() => { onStatusChangedRef.current = onStatusChanged; }, [onStatusChanged]);

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
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("bid-placed");
      socket.off("bidPlaced");
      socket.off("newBid");
      socket.off("auction-status-changed");
      socket.off("auctionStatusChanged");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("joinedAuction");
      socket.disconnect();
    };
  }, [auctionId, accessToken]);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { isConnected, participantCount, emit, socket: socketRef.current };
}
