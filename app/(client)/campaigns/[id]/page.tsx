"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, Loader2, Gem, Crown, Medal, HandHeart } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createSponsor } from '@/apis/sponsor';
import { getCampaign, getSponsorshipTiers } from '@/apis/campaign';
import Loader from '@/components/Loaders';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { CreateSponsorRequest, SponsorResponse, CampaignAPIResponse, SponsorshipTier } from '@/types/campaign';
import { z } from 'zod';
import { toast } from 'sonner';

const getTierConfig = (tierName: string) => {
  switch (tierName) {
    case 'diamond':
      return {
        badgeClass: 'bg-blue-100 text-blue-700 border border-blue-200',
        cardClass: 'border-blue-200 bg-gradient-to-br from-blue-50/80 to-white',
        iconClass: 'text-blue-600',
        Icon: Gem,
      };
    case 'gold':
      return {
        badgeClass: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        cardClass: 'border-yellow-200 bg-gradient-to-br from-yellow-50/80 to-white',
        iconClass: 'text-yellow-600',
        Icon: Crown,
      };
    case 'silver':
      return {
        badgeClass: 'bg-gray-200 text-gray-700 border border-gray-300',
        cardClass: 'border-gray-300 bg-gradient-to-br from-gray-50 to-white',
        iconClass: 'text-gray-600',
        Icon: Medal,
      };
    default:
      return {
        badgeClass: 'bg-orange-100 text-orange-700 border border-orange-200',
        cardClass: 'border-orange-200 bg-gradient-to-br from-orange-50/80 to-white',
        iconClass: 'text-orange-600',
        Icon: HandHeart,
      };
  }
};

const parseSponsorshipAmount = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly ? Number(digitsOnly) : NaN;
};

const formatSponsorshipAmountInput = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '');
  if (!digitsOnly) {
    return '';
  }

  return new Intl.NumberFormat('vi-VN').format(Number(digitsOnly));
};

const sponsorFormSchema = z.object({
  name: z.string().trim().min(1, 'Vui lòng nhập tên nhà tài trợ'),
  contactInfo: z.string().optional(),
  sponsorshipAmount: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số tiền tài trợ hợp lệ')
    .refine((value) => {
      const amount = parseSponsorshipAmount(value);
      return !Number.isNaN(amount) && amount > 0;
    }, 'Vui lòng nhập số tiền tài trợ hợp lệ'),
  logo: z.custom<File | null>((file) => file instanceof File, {
    message: 'Vui lòng tải lên logo nhà tài trợ',
  }),
});

type SponsorFormValues = z.infer<typeof sponsorFormSchema>;

const CampaignDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<CampaignAPIResponse | null>(null);
  const [tiers, setTiers] = useState<SponsorshipTier[]>([]);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingSponsorData, setPendingSponsorData] = useState<CreateSponsorRequest | null>(null);
  const [confirmMeta, setConfirmMeta] = useState<{ amount: number; tierDisplay: string; tierName?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorFormSchema),
    defaultValues: {
      name: '',
      contactInfo: '',
      sponsorshipAmount: '',
      logo: null,
    },
  });

  const sponsorshipAmountInput = watch('sponsorshipAmount');

  // Fetch campaign data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCampaign(true);
        const [campaignRes, tiersRes] = await Promise.all([
          getCampaign(campaignId),
          getSponsorshipTiers(campaignId)
        ]);
        setCampaign(campaignRes.data);
        setTiers(tiersRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setFormError('Không thể tải chi tiết chiến dịch.');
      } finally {
        setLoadingCampaign(false);
      }
    };

    if (campaignId) {
      fetchData();
    }
  }, [campaignId]);

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('sponsorshipAmount', formatSponsorshipAmountInput(e.target.value), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    setValue('logo', file, { shouldDirty: true, shouldValidate: true });
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setPreviewUrl(null);
    setValue('logo', null, { shouldDirty: true, shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const submitSponsor = async (sponsorData: CreateSponsorRequest) => {
    try {
      setSubmitting(true);
      setFormError(null);

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
      setConfirmDialogOpen(false);
      setPendingSponsorData(null);
      setConfirmMeta(null);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!pendingSponsorData) {
      setConfirmDialogOpen(false);
      return;
    }

    await submitSponsor(pendingSponsorData);
  };

  const handleSubmit = async (values: SponsorFormValues) => {
    const sponsorshipAmountValue = parseSponsorshipAmount(values.sponsorshipAmount);
    if (Number.isNaN(sponsorshipAmountValue) || sponsorshipAmountValue <= 0) {
      setFormError('Vui lòng nhập số tiền tài trợ hợp lệ');
      return;
    }

    if (!(values.logo instanceof File)) {
      setFormError('Vui lòng tải lên logo nhà tài trợ');
      return;
    }

    setFormError(null);

    const sponsorData: CreateSponsorRequest = {
      name: values.name.trim(),
      contactInfo: (values.contactInfo || '').trim(),
      sponsorshipAmount: sponsorshipAmountValue,
      campaignId: parseInt(campaignId, 10),
      file: values.logo,
    };

    setPendingSponsorData(sponsorData);
    setConfirmMeta({
      amount: sponsorshipAmountValue,
      tierDisplay: activeTier ? activeTier.tierDisplay : 'Chưa đạt mốc',
      tierName: activeTier?.tierName,
    });
    setConfirmDialogOpen(true);
  };

  const activeTier = sponsorshipAmountInput
    ? [...tiers]
        .sort((a, b) => b.minPrice - a.minPrice)
        .find((tier) => parseSponsorshipAmount(sponsorshipAmountInput) >= tier.minPrice)
    : null;

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
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-300">
                    <Image 
                      src={campaign.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop"} 
                      alt={campaign.title} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight border-b-2 border-[#FF6E1A] inline-block pb-1">Hạng Mục Tài Trợ</h3>
                  <div className="space-y-3">
                    {tiers.length > 0 ? (
                      tiers.map((tier) => (
                        <div
                          key={tier.id}
                          className={`p-4 rounded-xl border shadow-sm hover:border-[#FF6E1A] transition-all ${getTierConfig(tier.tierName).cardClass}`}
                        >
                          <div className="flex justify-between items-center">
                            <span
                              className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded inline-flex items-center gap-1.5 ${getTierConfig(tier.tierName).badgeClass}`}
                            >
                              {React.createElement(getTierConfig(tier.tierName).Icon, {
                                className: `w-3.5 h-3.5 ${getTierConfig(tier.tierName).iconClass}`,
                              })}
                              {tier.tierDisplay}
                            </span>
                            <span className="font-bold text-gray-900">
                              từ {new Intl.NumberFormat('vi-VN').format(tier.minPrice)}đ
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">Không có thông tin hạng mục tài trợ.</p>
                    )}
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
              <p className="text-gray-600 mb-6 whitespace-pre-line">{campaign.description}</p>

              {/* Progress Bar */}
              <div className="bg-white/50 p-6 border border-gray-300 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-700">Tiến Độ Quyên Góp</span>
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

            <form onSubmit={handleFormSubmit(handleSubmit)}>
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
                      {...register('name')}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6E1A] bg-white text-sm font-bold"
                      placeholder="Nhập tên tổ chức hoặc cá nhân của bạn"
                    />
                    {errors.name && <p className="mt-1 text-xs font-bold text-red-600">{errors.name.message}</p>}
                  </div>

                  {/* Contact Info */}
                  <div>
                    <label htmlFor="contactInfo" className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-widest">
                      Thông Tin Liên Hệ
                    </label>
                    <input
                      type="text"
                      id="contactInfo"
                      {...register('contactInfo')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6E1A] bg-white text-sm font-bold"
                      placeholder="Số điện thoại hoặc email"
                    />
                  </div>

                  {/* Sponsorship Amount */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="sponsorshipAmount" className="block text-xs font-bold text-gray-700 uppercase tracking-widest">
                        Số Tiền Tài Trợ *
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        id="sponsorshipAmount"
                        {...register('sponsorshipAmount')}
                        value={sponsorshipAmountInput || ''}
                        onChange={handleAmountInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6E1A] bg-white text-sm font-bold"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">đ</span>
                    </div>
                    {errors.sponsorshipAmount && <p className="mt-1 text-xs font-bold text-red-600">{errors.sponsorshipAmount.message}</p>}
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
                    Logo *
                  </label>
                  {errors.logo && <p className="mb-2 text-xs font-bold text-red-600">{errors.logo.message}</p>}
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
                        required
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

      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={() => {
          setConfirmDialogOpen(false);
          setPendingSponsorData(null);
          setConfirmMeta(null);
        }}
        onConfirm={handleConfirmSubmit}
        title="Xác nhận tài trợ"
        description={
          confirmMeta ? (
            <>
              Xác nhận tài trợ{' '}
              <span className="font-black text-orange-600">
                {new Intl.NumberFormat('vi-VN').format(confirmMeta.amount)} đồng
              </span>{' '}
              để trở thành nhà tài trợ{' '}
              <span
                className={`font-black ${
                  confirmMeta.tierName ? getTierConfig(confirmMeta.tierName).iconClass : 'text-gray-600'
                }`}
              >
                {confirmMeta.tierDisplay}
              </span>
              . Bấm thanh toán để tiếp tục.
            </>
          ) : (
            'Bạn có muốn tiếp tục thanh toán?'
          )
        }
        cancelText="Xem lại"
        confirmText="Thanh toán"
        variant="warning"
        isLoading={submitting}
      />
    </div>
  );
};

export default CampaignDetailPage;