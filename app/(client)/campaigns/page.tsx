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
    <div className="border border-[#b8aaaa] dark:bg-gray-800 transition-all duration-300 hover:shadow-md hover:border-[#FF6E1A]/50 overflow-hidden flex flex-col h-full dark:border-gray-700">
      
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <Image
          src={campaign.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop"}
          alt={campaign.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Header with Info */}
      <div className="p-4 pb-2">
        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
          {campaign.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {campaign.description}
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 mt-auto">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-[#FF6E1A]" />
            Hạn chót: {new Date(campaign.deadline).toLocaleDateString('vi-VN')}
          </span>
        </div>

        {/* Action Button */}
        <Link href={`/campaigns/${campaign.campaignId}`}>
          <button className="w-full flex items-center justify-center bg-[#FF6E1A] hover:bg-[#FF6E1A] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Ủng Hộ Chiến Dịch
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </Link>
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
    <section className="min-h-screen pt-32 w-full bg-[#EAE6E0] dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Campaigns Grid */}
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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