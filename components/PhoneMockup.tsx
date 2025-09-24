'use client'

import Image, { StaticImageData } from 'next/image';

interface PhoneMockupProps {
  appLogoSrc: StaticImageData;
  appLogoAlt: string;
}

export default function PhoneMockup({ appLogoSrc, appLogoAlt }: PhoneMockupProps) {
  return (
    // Thay đổi màu viền thành `border-border`
    <div className="relative w-72 h-[480px] bg-white dark:bg-black rounded-3xl shadow-xl border-4 border-border flex items-center justify-center overflow-hidden">
      {/* Màn hình điện thoại */}
      <div className="absolute inset-0 m-1.5 bg-gray-100 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
        {/* Nội dung bên trong màn hình */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={appLogoSrc}
            alt={appLogoAlt}
            layout="fill"
            objectFit="cover"
            className="rounded-2xl"
          />
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-2 w-24 h-1 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
}