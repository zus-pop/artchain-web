"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { createSponsor } from '@/apis/sponsor';
import { CreateSponsorRequest, SponsorResponse } from '@/types/campaign';

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
        // Open checkout URL in new tab
        window.open(response.data.checkoutUrl, '_blank');

        // Redirect to success page with order code
        router.push(`/payment/success?orderCode=${response.data.order.orderCode}`);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/campaigns" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Campaigns
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto">
          {/* Sponsorship Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Become a Sponsor</h2>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <Upload className="w-5 h-5 mr-2 text-gray-500" />
                    Choose File
                  </label>
                  {logoFile && (
                    <span className="text-sm text-gray-600">{logoFile.name}</span>
                  )}
                </div>
              </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter amount in VND"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;