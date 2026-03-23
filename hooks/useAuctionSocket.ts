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

  const onBidPlacedRef = useRef(onBidPlaced);
  const onStatusChangedRef = useRef(onStatusChanged);
  useEffect(() => { onBidPlacedRef.current = onBidPlaced; }, [onBidPlaced]);
  useEffect(() => { onStatusChangedRef.current = onStatusChanged; }, [onStatusChanged]);

  useEffect(() => {
    if (!auctionId) return;

    // Using the official namespace 'auction' from backend docs
    const socket = io(`${WS_URL}/auction`, {
      auth: { 
        token: accessToken,
        Authorization: `Bearer ${accessToken}` 
      },
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;



    socket.on("connect", () => {
      setIsConnected(true);
      
      const idStr = String(auctionId);
      const idNum = Number(auctionId);
      
      // Official event from docs: joinAuction
      socket.emit("joinAuction", { auctionId: idStr });
      socket.emit("joinAuction", { auctionId: idNum });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", () => {
      // Quietly handle connection errors
    });

    // Listen for official backend events with flexible mapping
    const handleNewBid = (rawEvent: any) => {
      // Standardize the event structure based on live logs
      const event: BidPlacedEvent = {
        bidId: rawEvent.bidId || rawEvent.id || `ws-${Date.now()}`,
        auctionId: String(rawEvent.auctionId || ""),
        auctionPaintingId: String(rawEvent.auctionPaintingId || ""),
        userId: rawEvent.bidderId || rawEvent.userId || rawEvent.user_id || rawEvent.user?.userId || rawEvent.user?.id || "",
        userName: rawEvent.userName || rawEvent.user?.fullName || rawEvent.user?.name || "",
        amount: Number(rawEvent.currentBid || rawEvent.bidAmount || rawEvent.amount || 0),
        createdAt: rawEvent.createdAt || new Date().toISOString(),
      };

      if (event.amount > 0) {
        onBidPlacedRef.current?.(event);
      }
    };

    socket.on("newBid", handleNewBid);
    socket.on("bidPlaced", handleNewBid);
    socket.on("auctionStatusChanged", (data: AuctionStatusChangedEvent) => {
      onStatusChangedRef.current?.(data);
    });

    socket.on("participantCount", (count: number) => {
      setParticipantCount(count);
    });

    return () => {
      socket.emit("leave-auction", { auctionId: String(auctionId) });
      socket.disconnect();
    };
  }, [auctionId, accessToken]);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { isConnected, participantCount, emit, socket: socketRef.current };
}
