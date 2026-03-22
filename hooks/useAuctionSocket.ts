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

    socket.onAny((event, ...args) => {
      console.log(`🔥 [ANY EVENT]: ${event}`, args);
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("🌐 Socket connected (Namespace: auction):", socket.id);
      
      const idStr = String(auctionId);
      const idNum = Number(auctionId);
      
      console.log("📤 Joining auction room:", idStr);
      
      // Official event from docs: joinAuction
      socket.emit("joinAuction", { auctionId: idStr });
      socket.emit("joinAuction", { auctionId: idNum });
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      console.log("🔌 Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    // Listen for official backend events with flexible mapping
    const handleNewBid = (rawEvent: any) => {
      console.log("🔥 RAW WS EVENT:", rawEvent);
      
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

      console.log("🔨 MAPPED WS BID:", event);
      if (event.amount > 0) {
        onBidPlacedRef.current?.(event);
      } else {
        console.warn("⚠️ Received WS bid with 0 or undefined amount", rawEvent);
      }
    };

    socket.on("newBid", handleNewBid);
    socket.on("bidPlaced", handleNewBid);
    socket.on("joinedAuction", (data) => console.log("✅ Joined auction successfully:", data));
    socket.on("userJoined", (data) => console.log("👤 Someone joined auction:", data));
    socket.on("bidError", (err) => console.error("⚠️ Bid Error from server:", err));
    socket.on("error", (err) => console.error("❌ Socket error event:", err));

    socket.on("auctionStatusChanged", (data: AuctionStatusChangedEvent) => {
      console.log("📢 Auction status changed:", data);
      onStatusChangedRef.current?.(data); // Changed to use ref
    });

    socket.on("participantCount", (count: number) => {
      console.log("👥 Participant count updated:", count);
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
