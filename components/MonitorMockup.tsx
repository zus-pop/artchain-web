'use client'

import Image, { StaticImageData } from 'next/image';

interface MonitorMockupProps {
  webScreenshotSrc: StaticImageData;
  webScreenshotAlt: string;
}

export default function MonitorMockup({ webScreenshotSrc, webScreenshotAlt }: MonitorMockupProps) {
  return (
    // Thay đổi màu viền thành `border-border`
    <div className="relative w-[500px] h-[350px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-4 border-border p-2 flex flex-col justify-start items-center">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center px-3 space-x-2">
        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
        <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        <div className="flex-grow flex justify-center">
          <div className="bg-gray-300 dark:bg-gray-600 px-4 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300">
            rizz.com
          </div>
        </div>
      </div>

      {/* Màn hình hiển thị nội dung */}
      <div className="mt-8 flex-grow w-full h-[calc(100%-32px)] bg-gray-100 dark:bg-gray-900 rounded-b-lg overflow-hidden relative">
        <Image
          src={webScreenshotSrc}
          alt={webScreenshotAlt}
          layout="fill"
          objectFit="cover"
          className="rounded-b-lg"
        />
      </div>

      {/* Chân đế màn hình */}
      <div className="absolute bottom-[-20px] w-24 h-4 bg-border rounded-b-lg bg-white"></div>
      <div className="absolute bottom-[-30px] w-32 h-3 bg-border rounded-b-lg transform bg-white rotate-3"></div>
      <div className="absolute bottom-[-30px] w-32 h-3 bg-border rounded-b-lg transform bg-white -rotate-3"></div>
    </div>
  );
}