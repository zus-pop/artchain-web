"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  contractAddress: string;
  tokenId: number | string;
  chainId?: string; // optional (e.g. "0xaa36a7" for Sepolia)
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

const MetaMaskIntegrationButton: React.FC<Props> = ({
  contractAddress,
  tokenId,
  chainId,
}) => {
  const [loading, setLoading] = useState(false);
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  const addNFTToWallet = async () => {
    console.log(contractAddress, tokenId, chainId);
    if (!window.ethereum) {
      setShowInstallDialog(true);
      return;
    }

    try {
      setLoading(true);

      // 1. Check network (optional nhưng nên có)
      if (chainId) {
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (currentChainId !== chainId) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainId }], // chainId must be in hexadecimal numbers
          });
        }
      }

      // 2. Request add NFT
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC721",
          options: {
            address: contractAddress,
            tokenId: tokenId.toString(),
          },
        },
      });

      if (wasAdded) {
        toast.success("Đã thêm NFT vào MetaMask thành công!");
        console.log("Đã thêm NFT vào ví!");
      } else {
        toast.error("Người dùng đã từ chối thêm NFT.");
        console.log("Người dùng từ chối");
      }
    } catch (error: any) {
      if (error?.code === 4001) {
        toast.error("Bạn đã từ chối yêu cầu từ MetaMask.");
      } else {
        toast.error("Đã xảy ra lỗi khi thêm NFT vào MetaMask.");
      }
      console.error("Lỗi khi thêm NFT:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={addNFTToWallet}
        disabled={loading}
        className="cursor-pointer bg-[#f6851b] text-white hover:bg-[#e55a00] hover:text-white"
      >
        {loading ? "Đang thêm..." : "Thêm NFT vào MetaMask"}
      </Button>

      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#423137]">
              MetaMask chưa được cài đặt
            </DialogTitle>
            <DialogDescription className="text-[#423137]/80">
              Vui lòng cài đặt tiện ích mở rộng MetaMask để thêm NFT vào ví của
              bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowInstallDialog(false)}
              className="cursor-pointer border-[#e6e2da] hover:bg-[#FF6E1A] hover:text-white"
            >
              Đóng
            </Button>
            <Button
              asChild
              className="cursor-pointer bg-[#FF6E1A] text-white hover:bg-[#e55a00] hover:text-white"
            >
              <a
                href="https://metamask.io/download.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cài đặt MetaMask
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MetaMaskIntegrationButton;
