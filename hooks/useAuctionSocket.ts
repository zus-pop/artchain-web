"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { BidPlacedEvent, AuctionStatusChangedEvent, AuctionStatus } from "@/types/auction";
import { useAuthStore } from "@/store";

const WS_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
  "https://api.artchain.io.vn";

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
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("🔌 Socket connected:", socket.id);
      // join the auction room
      socket.emit("join-auction", { auctionId: String(auctionId) });
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

    // Auction status change  (ACTIVE → ENDED etc.)
    socket.on("auction-status-changed", (data: AuctionStatusChangedEvent) => {
      console.log("🚩 Status changed (auction-status-changed):", data);
      onStatusChangedRef.current?.(data);
    });

    socket.on("auctionStatusChanged", (data: AuctionStatusChangedEvent) => {
      console.log("🚩 Status changed (auctionStatusChanged):", data);
      onStatusChangedRef.current?.(data);
    });

    // join the auction room
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("🔌 Socket connected:", socket.id);
      socket.emit("join-auction", { auctionId: String(auctionId) });
      socket.emit("joinAuction", { auctionId: String(auctionId) });
    });
  }, [auctionId, accessToken]);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { isConnected, participantCount, emit, socket: socketRef.current };
}
