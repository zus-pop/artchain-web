"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { createSponsor } from '@/apis/sponsor';
import { getCampaign } from '@/apis/campaign';
import Loader from '@/components/Loaders';
import { CreateSponsorRequest, SponsorResponse, CampaignAPIResponse } from '@/types/campaign';
import { toast } from 'sonner';

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
        setFormError('Không thể tải chi tiết chiến dịch.');
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
      setFormError('Vui lòng nhập tên nhà tài trợ');
      return;
    }

    if (!formData.sponsorshipAmount || parseFloat(formData.sponsorshipAmount) <= 0) {
      setFormError('Vui lòng nhập số tiền tài trợ hợp lệ');
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
        window.open(response.data.checkoutUrl, '_blank', 'noopener,noreferrer');
      } else {
        setFormError('Không thể tạo tài trợ. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Error creating sponsor:', err);
      setFormError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 bg-[#EAE6E0]">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/campaigns" className="flex items-center text-gray-600 hover:text-gray-900 font-bold text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Xem Tất Cả Chiến Dịch
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingCampaign ? (
          <div className="text-center py-8">
            <Loader />
            <p className="mt-4 text-sm font-bold animate-pulse text-[#FF6E1A]">Đang tải chi tiết chiến dịch...</p>
          </div>
        ) : campaign ? (
          <>
            <div className="mb-8">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-6 border border-gray-300">
                <Image 
                  src={campaign.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop"} 
                  alt={campaign.title} 
                  fill 
                  className="object-cover"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
              <p className="text-gray-600 mb-6 whitespace-pre-line">{campaign.description}</p>

              {/* Progress Bar */}
              <div className="bg-white/50 p-6 border border-gray-300 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-700">Tiến Độ Quyênh Góp</span>
                  <span className="text-sm font-bold text-[#FF6E1A]">
                    {new Intl.NumberFormat('vi-VN').format(Number(campaign.currentAmount))}đ / {new Intl.NumberFormat('vi-VN').format(Number(campaign.goalAmount))}đ
                  </span>
                </div>
                <div className="w-full bg-gray-100 border border-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#FF6E1A] h-2.5 rounded-full transition-all duration-300 m-[1px]"
                    style={{
                      width: `${Math.min((parseFloat(campaign.currentAmount) / parseFloat(campaign.goalAmount)) * 100, 100)}%`
                    }}
                  ></div>
                </div>
                <p className="text-xs font-bold text-gray-500 mt-2">
                  {((parseFloat(campaign.currentAmount) / parseFloat(campaign.goalAmount)) * 100).toFixed(1)}% đã được tài trợ
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Trở Thành Nhà Tài Trợ</h2>

            {formError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
                <p className="text-red-700 text-sm font-bold">{formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Sponsor Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-widest">
                      Tên Nhà Tài Trợ *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6E1A] bg-white text-sm font-bold"
                      placeholder="Nhập tên tổ chức hoặc cá nhân của bạn"
                    />
                  </div>

                  {/* Contact Info */}
                  <div>
                    <label htmlFor="contactInfo" className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-widest">
                      Thông Tin Liên Hệ
                    </label>
                    <input
                      type="text"
                      id="contactInfo"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6E1A] bg-white text-sm font-bold"
                      placeholder="Số điện thoại hoặc email"
                    />
                  </div>

                  {/* Sponsorship Amount */}
                  <div>
                    <label htmlFor="sponsorshipAmount" className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-widest">
                      Số Tiền Tài Trợ *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="sponsorshipAmount"
                        name="sponsorshipAmount"
                        value={formData.sponsorshipAmount}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6E1A] bg-white text-sm font-bold"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">đ</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#FF6E1A] hover:bg-[#FF833B] disabled:bg-gray-400 text-white font-bold py-4 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm uppercase tracking-widest"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Xác Nhận Tài Trợ'
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-widest">
                    Logo (Tùy Chọn)
                  </label>
                  {previewUrl ? (
                    <div className="bg-white p-4 rounded-lg border border-gray-300">
                      <img src={previewUrl} alt="Logo preview" className="max-w-full h-auto rounded-lg mb-4 mx-auto" />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-xs uppercase tracking-widest"
                      >
                        Xóa Logo
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
                        className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#ff6e1a] hover:bg-white transition-all w-full"
                      >
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <span className="text-xs font-bold text-gray-500 uppercase">Tải Lên File</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="font-bold text-gray-500">Không tìm thấy chiến dịch.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetailPage;