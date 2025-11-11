"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Target, ArrowRight, Loader2 } from 'lucide-react';
import { getCampaigns } from '@/apis/campaign';
import { CampaignAPIResponse } from '@/types/campaign';

const CampaignCard = ({ campaign }: { campaign: CampaignAPIResponse }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl overflow-hidden flex flex-col h-full border border-gray-100 dark:border-gray-700">

      {/* Header with Status Badge */}
      <div className="p-4 pb-2">
        {/* <div className="flex justify-between items-start mb-2">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            isCompleted ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            isActive ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {campaign.status}
          </span>
        </div> */}

        {/* Title */}
        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
          {campaign.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {campaign.description}
        </p>
      </div>

      {/* Progress Section
      <div className="px-4 pb-4">
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ${parseFloat(campaign.currentAmount).toLocaleString()} raised
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ${parseFloat(campaign.goalAmount).toLocaleString()} goal
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                progress >= 100 ? 'bg-green-500' :
                progress >= 75 ? 'bg-blue-500' :
                progress >= 50 ? 'bg-yellow-500' : 'bg-[#FF6E1A]0'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="text-right mt-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {progress.toFixed(1)}% funded
            </span>
          </div>
        </div>
      </div> */}

      {/* Footer */}
      <div className="px-4 pb-4 mt-auto">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-[#FF6E1A]0" />
            Deadline: {new Date(campaign.deadline).toLocaleDateString('vi-VN')}
          </span>
        </div>

        {/* Action Button */}
        <Link href={`/campaigns/${campaign.campaignId}`}>
          <button className="w-full flex items-center justify-center bg-[#FF6E1A] hover:bg-[#FF6E1A] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Support Campaign
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
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Supporting Art & Culture
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover amazing campaigns that bring art and culture to life. Support creative projects and make a difference.
            </p>
          </div>

          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6E1A]" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading campaigns...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Supporting Art & Culture
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover amazing campaigns that bring art and culture to life. Support creative projects and make a difference.
            </p>
          </div>

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
    <section className="py-16 px-4 pt-25 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Supporting Art & Culture
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover amazing campaigns that bring art and culture to life. Support creative projects and make a difference in our creative community.
          </p>
        </div> */}

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
              No Active Campaigns
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Check back later for new campaigns to support.
            </p>
          </div>
        )}

        {/* View All Button - Hidden since this is the full campaigns page */}
        {/* {campaigns.length > 0 && (
          <div className="text-center">
            <Link href="/campaigns">
              <button className="inline-flex items-center bg-[#FF6E1A] hover:bg-[#FF6E1A] text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                View All Campaigns
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
          </div>
        )} */}
      </div>
    </section>
  );
};

export default CampaignPage;