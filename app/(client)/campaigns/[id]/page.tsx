"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { createSponsor } from '@/apis/sponsor';
import { getCampaign } from '@/apis/campaign';
import { CreateSponsorRequest, SponsorResponse, CampaignAPIResponse } from '@/types/campaign';

const CampaignDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contactInfo: '',
    sponsorshipAmount: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<CampaignAPIResponse | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch campaign data
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoadingCampaign(true);
        const response = await getCampaign(campaignId);
        setCampaign(response.data);
      } catch (error) {
        console.error('Error fetching campaign:', error);
        setFormError('Failed to load campaign details.');
      } finally {
        setLoadingCampaign(false);
      }
    };

    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setFormError('Sponsor name is required');
      return;
    }

    if (!formData.sponsorshipAmount || parseFloat(formData.sponsorshipAmount) <= 0) {
      setFormError('Please enter a valid sponsorship amount');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      const sponsorData: CreateSponsorRequest = {
        name: formData.name.trim(),
        contactInfo: formData.contactInfo.trim(),
        sponsorshipAmount: parseFloat(formData.sponsorshipAmount),
        campaignId: parseInt(campaignId),
        file: logoFile || undefined,
      };

      const response: SponsorResponse = await createSponsor(sponsorData);

      if (!response.error && response.data.checkoutUrl) {
        // Open checkout URL in new tab - PayOS will handle redirects to success/cancel URLs
        window.open(response.data.checkoutUrl, '_blank');

        // Show success message - user will be redirected by PayOS after payment
        setFormError(null);
        alert('Payment page opened in new tab. Please complete your payment there.');
      } else {
        setFormError('Failed to create sponsorship. Please try again.');
      }
    } catch (err) {
      console.error('Error creating sponsor:', err);
      setFormError('Failed to create sponsorship. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-25 bg-[#EAE6E0]">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/campaigns" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              See all Campaigns
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingCampaign ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading campaign details...</p>
          </div>
        ) : campaign ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
              <p className="text-gray-600 mb-6">{campaign.description}</p>

              {/* Progress Bar */}
              <div className="bg-[#EAE6E0] p-6 border border-gray-300 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">
                    {parseFloat(campaign.currentAmount).toLocaleString()} VND / {parseFloat(campaign.goalAmount).toLocaleString()} VND
                  </span>
                </div>
                <div className="w-full border border-[#FF6E1A] rounded-full h-4">
                  <div
                    className="bg-[#FF6E1A] h-4 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((parseFloat(campaign.currentAmount) / parseFloat(campaign.goalAmount)) * 100, 100)}%`
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {((parseFloat(campaign.currentAmount) / parseFloat(campaign.goalAmount)) * 100).toFixed(1)}% funded
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Become a Sponsor</h2>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-md">
                <p className="text-red-700 text-sm">{formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Sponsor Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Sponsor Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF6E1A] focus:bg-[#FF6E1A]/10 focus:border-transparent"
                      placeholder="Enter your organization or personal name"
                    />
                  </div>

                  {/* Contact Info */}
                  <div>
                    <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Information
                    </label>
                    <input
                      type="text"
                      id="contactInfo"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF6E1A] focus:bg-[#FF6E1A]/10 focus:border-transparent"
                      placeholder="Phone number or email"
                    />
                  </div>

                  {/* Sponsorship Amount */}
                  <div>
                    <label htmlFor="sponsorshipAmount" className="block text-sm font-medium text-gray-700 mb-2">
                      Sponsorship Amount *
                    </label>
                    <input
                      type="number"
                      id="sponsorshipAmount"
                      name="sponsorshipAmount"
                      value={formData.sponsorshipAmount}
                      onChange={handleInputChange}
                      required
                      min="100"
                      step="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF6E1A] focus:bg-[#FF6E1A]/10 focus:border-transparent"
                      placeholder="Enter amount in VND"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#FF6E1A] hover:bg-[#FF833B] disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Become a Sponsor'
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo (Optional)
                  </label>
                  {previewUrl ? (
                    <div>
                      <img src={previewUrl} alt="Logo preview" className="max-w-full h-auto rounded-md border border-gray-300 mb-4" />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                      >
                        Remove Logo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="logo-upload"
                        ref={fileInputRef}
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-[#ff6e1a] w-full"
                      >
                        <Upload className="w-5 h-5 mr-2 text-gray-500" />
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <p>Campaign not found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetailPage;