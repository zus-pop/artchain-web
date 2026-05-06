"use client";

import { getCampaigns } from "@/apis/campaign";
import GlassSurface from "@/components/GlassSurface";
import Loader from "@/components/Loaders";
import { CampaignAPIResponse, CampaignStatus } from "@/types/campaign";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CircleDollarSign, Clock, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const getCampaignStatusConfig = (status: CampaignStatus) => {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Đang diễn ra",
        className: "bg-emerald-100 text-emerald-700 border-emerald-200",
      };
    case "COMPLETED":
      return {
        label: "Đã kết thúc",
        className: "bg-gray-100 text-gray-700 border-gray-200",
      };
    case "DRAFT":
      return {
        label: "Bản Nháp",
        className: "bg-amber-100 text-amber-700 border-amber-200",
      };
    case "CANCELLED":
      return {
        label: "Đã Hủy",
        className: "bg-red-100 text-red-700 border-red-200",
      };
    case "CLOSED":
    default:
      return {
        label: "Đã Đóng",
        className: "bg-gray-100 text-gray-700 border-gray-200",
      };
  }
};

// ── Interactive Overlay (from InteractivePostCard) ────────────────
const InteractiveOverlay = () => (
  <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden z-40">
    <div className="absolute -top-16 -right-16 w-32 h-32 origin-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] rotate-[-90deg] group-hover:rotate-0">
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <GlassSurface
          width={48}
          height={48}
          borderRadius={24}
          brightness={120}
          opacity={0.9}
          blur={8}
          className="items-center justify-center shadow-2xl border border-white/60"
        >
          <div className="flex items-center justify-center w-full h-full text-[var(--site-ink)]">
            <svg
              className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4V20M12 4L18 10M12 4L6 10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="rotate-45 origin-center"
              />
            </svg>
          </div>
        </GlassSurface>
      </div>
    </div>
  </div>
);

const CampaignCard = ({
  campaign,
  index,
}: {
  campaign: CampaignAPIResponse;
  index: number;
}) => {
  // Calculate remaining days
  const deadlineDate = new Date(campaign.deadline);
  const now = new Date();

  const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d2 = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    deadlineDate.getDate(),
  );

  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const formattedAmount = Number(campaign.goalAmount).toLocaleString("vi-VN");
  const campaignStatusConfig = getCampaignStatusConfig(campaign.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link
        href={`/campaigns/${campaign.campaignId}`}
        className="group flex flex-col h-full bg-white rounded-sm overflow-hidden border border-[#e6e2da] shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
      >
        {/* Image Section */}
        <div className="relative aspect-[16/11] overflow-hidden m-4 rounded-sm flex-shrink-0">
          <motion.div
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="w-full h-full"
          >
            <Image
              src={
                campaign.image ||
                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop"
              }
              alt={campaign.title}
              fill
              className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:blur-[2px]"
            />
          </motion.div>

          <InteractiveOverlay />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none z-30" />
        </div>

        {/* Content Section */}
        <div className="flex flex-col px-6 pb-8 pt-2 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${campaignStatusConfig.className}`}
            >
              {campaign.status === "ACTIVE" && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              )}
              {campaignStatusConfig.label}
            </span>
          </div>

          <h3 className="text-[22px] font-bold text-[#423137] leading-tight mb-3 group-hover:text-[#FF6E1A] transition-colors line-clamp-2">
            {campaign.title}
          </h3>

          <p className="text-[14px] text-[#423137]/60 font-medium leading-relaxed mb-10 line-clamp-2">
            {campaign.description}
          </p>

          {/* Footer Stats (EXACTLY AS ZOOMED IMAGE) */}
          <div className="mt-auto flex items-center text-[#423137] border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#423137]/40 stroke-[2]" />
              <span className="text-lg font-bold tracking-tight whitespace-nowrap">
                {diffDays} Ngày
              </span>
            </div>

            <div className="mx-5 h-5 w-[1px] bg-gray-200 flex-shrink-0" />

            <div className="flex items-center gap-3">
              <CircleDollarSign className="w-5 h-5 text-[#423137]/40 stroke-[2]" />
              <span className="text-lg font-bold tracking-tight whitespace-nowrap">
                {formattedAmount} VND
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const CampaignPage = () => {
  const [campaigns, setCampaigns] = useState<CampaignAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignsData = async () => {
      try {
        setLoading(true);
        const response = await getCampaigns({
          limit: 12,
        });
        setCampaigns(
          response.data.filter((campaign) => campaign.status !== "DRAFT"),
        );
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignsData();
  }, []);

  if (loading) {
    return (
      <div className="w-full pt-32 px-4 sm:px-8 lg:px-16 min-h-screen bg-[#EAE6E0] flex flex-col items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 w-full bg-[#EAE6E0] px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#423137] leading-[1.1] tracking-tight">
              <span className="text-[#FF6E1A]">Gây quỹ</span> nghệ thuật, <br />
              lan tỏa những ước mơ.
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/exhibition"
              className="group flex items-center gap-2 text-sm font-bold text-[#423137] hover:text-[#FF6E1A] transition-colors"
            >
              Khám phá bộ sưu tập
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Campaigns Grid */}
        <AnimatePresence>
          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {campaigns.map((campaign, index) => (
                <CampaignCard
                  key={campaign.campaignId}
                  campaign={campaign}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white/10 rounded-3xl border border-dashed border-[#423137]/10">
              <Target className="h-12 w-12 text-[#423137]/10 mx-auto mb-6" />
              <p className="text-base font-semibold text-[#423137]/30">
                Hiện tại chưa có chiến dịch nào
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CampaignPage;
