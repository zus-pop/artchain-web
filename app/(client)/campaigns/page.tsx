"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Target, ArrowRight } from 'lucide-react';
import Loader from '@/components/Loaders';
import { getCampaigns } from '@/apis/campaign';
import { CampaignAPIResponse } from '@/types/campaign';

const CampaignCard = ({ campaign }: { campaign: CampaignAPIResponse }) => {
  return (
    <div className="group bg-white border border-[#e6e2da] shadow-sm rounded-md overflow-hidden hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col h-full">
      
      {/* Image Section */}
      <Link href={`/campaigns/${campaign.campaignId}`} className="block w-full aspect-video overflow-hidden border-b border-[#e6e2da] relative">
        <Image
          src={campaign.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop"}
          alt={campaign.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <Link href={`/campaigns/${campaign.campaignId}`}>
          <h3 className="text-lg font-bold text-[#423137] leading-snug mb-2.5 line-clamp-2 hover:text-[#FF6E1A] transition-colors duration-200">
            {campaign.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-[#423137]/70 font-medium leading-relaxed mb-4 line-clamp-3 flex-1">
          {campaign.description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-3">
          <div className="flex items-center text-[10px] text-[#423137]/70 font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#423137]/40" />
            Hạn chót: {new Date(campaign.deadline).toLocaleDateString('vi-VN')}
          </div>

          {/* Action Button */}
          <Link href={`/campaigns/${campaign.campaignId}`}>
            <button className="w-full cursor-pointer bg-[#FF6E1A] hover:bg-[#FF833B] transition-colors duration-200 rounded-sm text-white text-xs font-bold tracking-wide px-4 py-2.5 flex items-center justify-center gap-1.5 shadow-sm">
              Ủng Hộ Chiến Dịch
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
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
          limit: 12
        });
        setCampaigns(response.data);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError('Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignsData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 min-h-screen bg-[#EAE6E0] dark:from-gray-900 dark:to-gray-800 text-center">
        <div className="max-w-7xl mx-auto">
          <Loader />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 min-h-screen bg-[#EAE6E0] dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="bg-[#FF6E1A] dark:bg-[#FF6E1A]/20 border border-[#FF6E1A] dark:border-[#FF6E1A] rounded-lg p-6 max-w-md mx-auto">
              <p className="text-[#FF6E1A] dark:text-[#FF6E1A] font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#FF6E1A] hover:bg-[#FF6E1A] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-16 w-full bg-[#EAE6E0] px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold tracking-widest text-[#423137]/60 uppercase mb-5">
           Chiến Dịch Gây Quỹ
        </p>
        {/* Campaigns Grid */}
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.campaignId} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Không Có Chiến Dịch Hoạt Động
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Hãy kiểm tra lại sau để xem các chiến dịch mới cần hỗ trợ.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CampaignPage;