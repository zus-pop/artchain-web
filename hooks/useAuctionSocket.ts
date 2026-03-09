"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { BidPlacedEvent, AuctionStatusChangedEvent, AuctionStatus } from "@/types/auction";
import { useAuthStore } from "@/store";

const WS_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
  "https://6vs4mkvt-3000.asse.devtunnels.ms";

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
      // join the auction room
      socket.emit("joinAuction", { auctionId });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Real-time bid event from server
    socket.on("bidPlaced", (data: BidPlacedEvent) => {
      onBidPlacedRef.current?.(data);
    });

    // Auction status change  (ACTIVE → ENDED etc.)
    socket.on("auctionStatusChanged", (data: AuctionStatusChangedEvent) => {
      onStatusChangedRef.current?.(data);
    });

    // Participant count update
    socket.on("participantCount", (count: number) => {
      setParticipantCount(count);
    });

    return () => {
      socket.emit("leaveAuction", { auctionId });
      socket.disconnect();
    };
  }, [auctionId, accessToken]);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { isConnected, participantCount, emit, socket: socketRef.current };
}
