"use client";

import { useGetUserAchievements } from "@/apis/achievements";
import {
  useGetMySubmissions,
  useGetUserSubmissions,
  useMintNFT,
} from "@/apis/paintings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { CompetitorSubmission, Painting } from "@/types/painting";
import { AxiosError } from "axios";
import { ChevronLeft, Copy, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const EVM_WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/;

export default function MintNFTPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const paintingId = searchParams.get("paintingId") || "";
  const competitorUserId = searchParams.get("competitorUserId") || "";
  const targetUserId = competitorUserId || user?.userId || "";

  const [walletAddress, setWalletAddress] = useState("");
  const [hasTouchedWallet, setHasTouchedWallet] = useState(false);
  const [mintResult, setMintResult] = useState<{
    transaction_hash: string;
    cid: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { mutate, isPending } = useMintNFT();
  const { data: mySubmissions, isLoading: isLoadingMySubmissions } =
    useGetMySubmissions();
  const { data: guardianSubmissions, isLoading: isLoadingGuardianSubmissions } =
    useGetUserSubmissions(competitorUserId || undefined);
  const { data: achievementsResp, isLoading: isLoadingAchievements } =
    useGetUserAchievements(targetUserId, Boolean(targetUserId && paintingId));

  const selectedSubmission = useMemo(() => {
    if (!paintingId) return null;

    if (competitorUserId) {
      if (!Array.isArray(guardianSubmissions)) return null;
      return (
        guardianSubmissions.find(
          (submission) => submission.paintingId === paintingId,
        ) || null
      );
    }

    return (
      mySubmissions?.find(
        (submission) => submission.paintingId === paintingId,
      ) || null
    );
  }, [competitorUserId, guardianSubmissions, mySubmissions, paintingId]);

  const selectedAchievement = useMemo(
    () =>
      achievementsResp?.data.achievements.find(
        (achievement) => achievement.paintingId === paintingId,
      ) || null,
    [achievementsResp, paintingId],
  );

  const contestTitle = useMemo(() => {
    if (!selectedSubmission) return "";

    if (competitorUserId) {
      return (selectedSubmission as CompetitorSubmission).contestTitle || "";
    }

    return (selectedSubmission as Painting).contest?.title || "";
  }, [competitorUserId, selectedSubmission]);

  const mintContext = useMemo(
    () => ({
      imageUrl: selectedSubmission?.imageUrl || "",
      paintingTitle:
        selectedSubmission?.title || selectedAchievement?.paintingTitle || "",
      contestTitle,
      awardName: selectedAchievement?.award?.name || "",
      awardRank: selectedAchievement?.award?.rank
        ? String(selectedAchievement.award.rank)
        : "",
      receiverName:
        achievementsResp?.data.user.fullName || user?.fullName || "",
    }),
    [
      achievementsResp,
      contestTitle,
      selectedAchievement,
      selectedSubmission,
      user?.fullName,
    ],
  );

  const isLoadingMintData =
    (competitorUserId
      ? isLoadingGuardianSubmissions
      : isLoadingMySubmissions) || isLoadingAchievements;

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
    Boolean(mintContext?.imageUrl) &&
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

    if (!mintContext?.imageUrl) {
      toast.error("Không tìm thấy dữ liệu tranh để mint NFT.");
      return;
    }

    if (!walletAddress.trim() || walletError) {
      return;
    }

    setSubmitError(null);
    mutate(
      {
        imageUrl: mintContext.imageUrl,
        receiver: walletAddress.trim(),
      },
      {
        onSuccess: (response) => {
          setMintResult(response);
          toast.success("Mint NFT thành công");
        },
        onError: (error) => {
          const fallbackMessage = "Mint NFT thất bại. Vui lòng thử lại.";
          const message =
            error instanceof AxiosError
              ? (error.response?.data?.message as string) || fallbackMessage
              : fallbackMessage;
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
                className="cursor-pointer bg-[#FF6E1A] text-white hover:opacity-90"
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
                className="cursor-pointer bg-[#FF6E1A] text-white hover:opacity-90"
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
          <h1 className="text-3xl font-bold text-[#423137]">Mint NFT</h1>
          <p className="mt-2 text-[#423137]/80">
            Tạo NFT cho tác phẩm đạt giải và lưu giao dịch trên blockchain.
          </p>
        </div>

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
                  {mintContext.awardRank
                    ? ` (Hạng ${mintContext.awardRank})`
                    : ""}
                </p>
                <p className="leading-relaxed">
                  <span className="font-semibold">Chủ sở hữu:</span>{" "}
                  {mintContext.receiverName || "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {!mintResult && (
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
                    className="cursor-pointer bg-[#FF6E1A] text-white hover:opacity-90"
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
                    className="cursor-pointer border-[#e6e2da]"
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
          )}
        </div>

        {mintResult && (
          <Card className="mt-6 border border-[#dbe7d4] bg-[#f6fbf2] shadow-md">
            <CardHeader className="pt-7 pb-4">
              <CardTitle className="text-xl text-[#2d6a4f]">
                Mint NFT thành công
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-1 pb-7 text-[#23453b]">
              <div className="space-y-2">
                <p className="text-sm font-semibold">Transaction Hash</p>
                <div className="flex flex-wrap items-start gap-2 rounded border border-[#cde2c1] bg-white p-3 sm:p-4">
                  <p className="break-all text-sm">
                    {mintResult.transaction_hash}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() =>
                      copyText(mintResult.transaction_hash, "transaction hash")
                    }
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">CID</p>
                <div className="flex flex-wrap items-start gap-2 rounded border border-[#cde2c1] bg-white p-3 sm:p-4">
                  <a
                    href={`https://${mintResult.cid}` || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-sm text-[#2d6a4f] underline underline-offset-2"
                  >
                    {mintResult.cid}
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => copyText(`https://${mintResult.cid}`, "cid")}
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <a
                    href={`https://${mintResult.cid}` || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#2d6a4f] hover:underline"
                  >
                    Mở IPFS
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {mintResult.cid && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">
                    Xem trước nội dung IPFS
                  </p>
                  <div className="overflow-hidden rounded border border-[#cde2c1] bg-white">
                    <iframe
                      src={`https://${mintResult.cid}`}
                      title="IPFS Preview"
                      className="h-[360px] w-full"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    router.push("/me");
                  }}
                  className="cursor-pointer bg-[#423137] text-white hover:opacity-90"
                >
                  Về hồ sơ
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
