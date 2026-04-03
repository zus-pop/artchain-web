"use client";

import { useGetPaintingById, useMintNFT } from "@/apis/paintings";
import MetaMaskIntegrationButton from "@/components/MetaMaskIntegration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ChevronLeft, Copy, ExternalLink, Wallet } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const EVM_WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/;

export default function MintNFTPage() {
  const queryClient = useQueryClient();

  const chainID = "0xaa36a7";
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

  const router = useRouter();
  const searchParams = useSearchParams();
  const paintingId = searchParams.get("paintingId") || "";

  const [walletAddress, setWalletAddress] = useState("");
  const [hasTouchedWallet, setHasTouchedWallet] = useState(false);
  const [mintResult, setMintResult] = useState<{
    transactionHash: string;
    cid: string;
    tokenId: string;
  } | null>(null);
  const [nftMetadata, setNftMetadata] = useState<string | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (mintResult?.cid) {
      const fetchMetadata = async () => {
        setIsLoadingMetadata(true);
        try {
          const url = mintResult.cid.startsWith("http")
            ? mintResult.cid
            : `https://${mintResult.cid}`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            setNftMetadata(JSON.stringify(data, null, 2));
          } else {
            console.error("Lỗi tải metadata HTTP:", res.status);
          }
        } catch (error) {
          console.error("Lỗi tải metadata:", error);
        } finally {
          setIsLoadingMetadata(false);
        }
      };
      fetchMetadata();
    }
  }, [mintResult?.cid]);

  const { mutate, isPending } = useMintNFT();

  const { data: painting, isLoading: isLoadingPainting } =
    useGetPaintingById(paintingId);

  useEffect(() => {
    if (painting?.nft) {
      setMintResult({
        transactionHash: painting.nft.transactionHash,
        cid: painting.nft.cid,
        tokenId: painting.nft.tokenId,
      });
    }
  }, [painting?.nft]);

  const mintContext = useMemo(
    () => ({
      imageUrl: painting?.imageUrl || "",
      paintingTitle: painting?.title || "",
      contestTitle: painting?.contest?.title || "",
      awardName: painting?.award?.name || "",
      receiverName: painting?.competitor?.user?.fullName || "",
    }),
    [painting],
  );

  const isLoadingMintData = isLoadingPainting;

  const walletError = useMemo(() => {
    if (!hasTouchedWallet) return "";
    if (!walletAddress.trim()) {
      return "Vui lòng nhập địa chỉ ví.";
    }
    if (!EVM_WALLET_REGEX.test(walletAddress.trim())) {
      return "Địa chỉ ví không hợp lệ. Định dạng hợp lệ: 0x + 40 ký tự hex.";
    }
    return "";
  }, [hasTouchedWallet, walletAddress]);

  const canSubmit =
    Boolean(paintingId) &&
    Boolean(walletAddress.trim()) &&
    !walletError &&
    !isPending &&
    !mintResult;

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`Đã sao chép ${label}`);
    } catch {
      toast.error("Không thể sao chép. Vui lòng thử lại.");
    }
  };

  const handleSubmit = () => {
    setHasTouchedWallet(true);

    if (!paintingId) {
      toast.error("Không tìm thấy dữ liệu tranh để mint NFT.");
      return;
    }

    if (!walletAddress.trim() || walletError) {
      return;
    }

    setSubmitError(null);
    mutate(
      {
        paintingId,
        receiver: walletAddress.trim(),
      },
      {
        onSuccess: (response) => {
          setMintResult(response);
          toast.success("Mint NFT thành công");
          queryClient.invalidateQueries({ queryKey: ["painting", paintingId] });
        },
        onError: (error) => {
          const fallbackMessage = "Mint NFT thất bại. Vui lòng thử lại.";
          let message = fallbackMessage;

          if (error instanceof AxiosError) {
            const apiMessage = error.response?.data?.message as string;
            // Map common English error messages to Vietnamese, or use the provided one
            if (apiMessage) {
              if (apiMessage.toLowerCase().includes("mint")) {
                message =
                  "Không thể mint NFT. Vui lòng kiểm tra lại trạng thái tác phẩm.";
              } else if (apiMessage.toLowerCase().includes("reverted")) {
                message =
                  "Giao dịch bị từ chối trên mạng lưới. Vui lòng thử lại.";
              } else {
                message = apiMessage; // Still display if we don't have a specific mapping, or fallback
              }
            }
          }

          setSubmitError(message);
          toast.error(message);
        },
      },
    );
  };

  if (!paintingId) {
    return (
      <div className="min-h-screen bg-[#fdfcf9] px-6 pb-10 pt-28 sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/me")}
            className="mb-4 cursor-pointer px-0 text-gray-700 hover:bg-transparent hover:text-[#FF6E1A]"
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            Quay lại hồ sơ
          </Button>

          <Card className="border border-[#e6e2da] bg-[#fffdf9] shadow-md">
            <CardHeader className="pt-7 pb-4">
              <CardTitle className="text-2xl font-bold text-[#423137]">
                Thiếu tham số dữ liệu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-1 pb-7 text-[#423137]">
              <p>
                Bạn vui lòng mở chi tiết giải thưởng và bấm nút Mint NFT từ
                trang hồ sơ.
              </p>
              <Button
                type="button"
                onClick={() => router.push("/me")}
                className="cursor-pointer bg-[#FF6E1A] text-white hover:bg-[#e55a00] hover:text-white"
              >
                Về trang hồ sơ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoadingMintData && !mintContext.imageUrl) {
    return (
      <div className="min-h-screen bg-[#fdfcf9] px-6 pb-10 pt-28 sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <Card className="border border-[#e6e2da] bg-[#fffdf9] shadow-md">
            <CardHeader className="pt-7 pb-4">
              <CardTitle className="text-2xl font-bold text-[#423137]">
                Đang tải dữ liệu tranh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-1 pb-7 text-[#423137]">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#423137]/20 border-t-[#423137]" />
                Vui lòng đợi trong giây lát...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!mintContext.imageUrl) {
    return (
      <div className="min-h-screen bg-[#fdfcf9] px-6 pb-10 pt-28 sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/me")}
            className="mb-4 cursor-pointer px-0 text-gray-700 hover:bg-transparent hover:text-[#FF6E1A]"
          >
            <ChevronLeft className="mr-1 h-5 w-5" />
            Quay lại hồ sơ
          </Button>

          <Card className="border border-[#e6e2da] bg-[#fffdf9] shadow-md">
            <CardHeader className="pt-7 pb-4">
              <CardTitle className="text-2xl font-bold text-[#423137]">
                Không tìm thấy tranh để mint
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-1 pb-7 text-[#423137]">
              <p>
                Không thể tải thông tin tranh từ tham số hiện tại. Bạn hãy quay
                lại và chọn lại tác phẩm.
              </p>
              <Button
                type="button"
                onClick={() => router.push("/me")}
                className="cursor-pointer bg-[#FF6E1A] text-white hover:bg-[#e55a00] hover:text-white"
              >
                Về trang hồ sơ
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fdfcf9] px-6 pb-10 pt-28 sm:pt-32">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-[#FF6E1A] blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-[#423137] blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/me")}
          className="mb-4 cursor-pointer px-0 text-gray-700 hover:bg-transparent hover:text-[#FF6E1A]"
        >
          <ChevronLeft className="mr-1 h-5 w-5" />
          Quay lại hồ sơ
        </Button>

        <div className="mb-6 border-b border-[#e6e2da] pb-4">
          <h1 className="text-3xl font-bold text-[#423137]">NFT</h1>
          <p className="mt-2 text-[#423137]/80">
            Tạo NFT cho tác phẩm đạt giải và lưu giao dịch trên blockchain.
          </p>
        </div>

        {!mintResult ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border border-[#e6e2da] bg-[#fffdf9] shadow-md">
              <CardHeader className="pt-7 pb-4">
                <CardTitle className="text-xl text-[#423137]">
                  Thông tin tác phẩm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-1 pb-7">
                <div className="relative h-72 w-full overflow-hidden rounded border border-[#e6e2da] bg-black/5">
                  <Image
                    src={mintContext.imageUrl}
                    alt={mintContext.paintingTitle || "Painting"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-3 text-[#423137]">
                  <p className="leading-relaxed">
                    <span className="font-semibold">Tác phẩm:</span>{" "}
                    {mintContext.paintingTitle || "-"}
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold">Cuộc thi:</span>{" "}
                    {mintContext.contestTitle || "-"}
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold">Giải thưởng:</span>{" "}
                    {mintContext.awardName || "-"}
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold">Chủ sở hữu:</span>{" "}
                    {mintContext.receiverName || "-"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#e6e2da] bg-[#fffdf9] shadow-md">
              <CardHeader className="pt-7 pb-4">
                <CardTitle className="text-xl text-[#423137]">
                  Thông tin mint
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-1 pb-7">
                <div className="space-y-2">
                  <Label htmlFor="walletAddress" className="text-[#423137]">
                    Địa chỉ ví người nhận (EVM)
                  </Label>
                  <Input
                    id="walletAddress"
                    value={walletAddress}
                    onChange={(event) => {
                      setWalletAddress(event.target.value);
                      if (!hasTouchedWallet) {
                        setHasTouchedWallet(true);
                      }
                    }}
                    placeholder="0x..."
                    className="border-[#e6e2da] focus-visible:ring-[#FF6E1A]/30"
                  />
                  {walletError ? (
                    <p className="text-sm text-[#d64b2a]">{walletError}</p>
                  ) : (
                    <p className="text-sm text-[#423137]/70">
                      Định dạng hợp lệ: 0x + 40 ký tự hexa (0-9, a-f, A-F).
                    </p>
                  )}
                </div>

                {submitError && (
                  <div className="rounded border border-[#f3c8bc] bg-[#fff2ef] p-3 text-sm text-[#b93f2b]">
                    {submitError}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="cursor-pointer bg-[#FF6E1A] text-white hover:bg-[#e55a00] hover:text-white"
                  >
                    {isPending ? "Đang mint..." : "Xác nhận mint NFT"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      router.push("/me");
                    }}
                    disabled={isPending}
                    className="cursor-pointer border-[#e6e2da] hover:bg-[#FF6E1A] hover:text-white"
                  >
                    Hủy
                  </Button>
                </div>

                {isPending && (
                  <div className="flex items-center gap-2 text-sm text-[#423137]">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#423137]/20 border-t-[#423137]" />
                    Đang gửi giao dịch lên hệ thống...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="mt-2 overflow-hidden border border-[#e6e2da] bg-[#fffdf9] shadow-md">
            <div className="border-b border-[#e6e2da] bg-linear-to-r from-[#FFF8F4] to-[#fffdf9] px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-[#FF6E1A]/10 p-2 text-[#FF6E1A]">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#423137]">
                      Thông tin NFT
                    </h2>
                    <p className="mt-1 text-sm text-[#423137]/80">
                      Giao dịch đã được ghi nhận. Bạn có thể lưu lại hash và CID
                      để tra cứu sau.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MetaMaskIntegrationButton
                    contractAddress={contractAddress}
                    tokenId={mintResult.tokenId}
                    chainId={chainID} // Sepolia
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      router.push("/me");
                    }}
                    className="cursor-pointer bg-[#423137] text-white hover:bg-[#FF6E1A] hover:text-white"
                  >
                    Về hồ sơ
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="grid gap-4 p-6 text-[#423137] sm:grid-cols-2 sm:p-8">
              <div className="space-y-2 rounded border border-[#e6e2da] bg-[#faf9f5] p-4 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#FF6E1A]">
                  Transaction Hash
                </p>
                <p className="break-all text-sm">
                  {mintResult.transactionHash}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer px-0 text-[#423137]/80 hover:bg-transparent hover:text-[#FF6E1A]"
                  onClick={() =>
                    copyText(mintResult.transactionHash, "transaction hash")
                  }
                >
                  <Copy className="h-4 w-4" />
                  Sao chép hash
                </Button>
              </div>

              <div className="space-y-2 rounded border border-[#e6e2da] bg-[#faf9f5] p-4 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#FF6E1A]">
                  CID
                </p>
                <a
                  href={`${mintResult.cid}` || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all text-sm text-[#423137] underline underline-offset-2 hover:text-[#FF6E1A]"
                >
                  {mintResult.cid}
                </a>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer px-0 text-[#423137]/80 hover:bg-transparent hover:text-[#FF6E1A]"
                    onClick={() => copyText(mintResult.cid, "cid")}
                  >
                    <Copy className="h-4 w-4" />
                    Sao chép CID
                  </Button>
                  <a
                    href={`${mintResult.cid}` || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#423137]/80 hover:text-[#FF6E1A] hover:underline"
                  >
                    Mở liên kết
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </CardContent>

            {mintResult.cid && (
              <div className="border-t border-[#e6e2da] px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
                <p className="mb-3 text-sm font-semibold text-[#FF6E1A]">
                  Nội dung Metadata (JSON)
                </p>
                <div className="overflow-hidden rounded border border-[#e6e2da] bg-[#faf9f5] p-4 shadow-sm">
                  {isLoadingMetadata ? (
                    <div className="flex h-[380px] items-center justify-center text-sm text-[#423137]/60">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#FF6E1A]/20 border-t-[#FF6E1A]" />
                      Đang tải Metadata...
                    </div>
                  ) : nftMetadata ? (
                    <pre className="max-h-[380px] overflow-y-auto whitespace-pre-wrap wrap-break-word text-sm text-[#423137]">
                      {nftMetadata}
                    </pre>
                  ) : (
                    <div className="flex h-[380px] items-center justify-center text-sm text-[#423137]/60">
                      Không thể tải JSON metadata. Truy cập CID trực tiếp để
                      xem.
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
