"use client";
import React from "react";

const Exhibition3DLayout = ({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) => {
  return <div className="w-screen h-screen bg-black">{children}</div>;
};

export default Exhibition3DLayout;
