"use client";
import { useMeQuery } from "@/hooks";
import { SocketProvider } from "@/providers";
import React from "react";

export default function Exhibition3DLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const { data } = useMeQuery();
  const username =
    data?.fullName || `Guest-${Math.floor(Math.random() * 1000)}`;
  return (
    <SocketProvider namespace="exhibition-3D" query={{ name: username }}>
      <div className="w-screen h-screen bg-black">{children}</div>
    </SocketProvider>
  );
}
