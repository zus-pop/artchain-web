"use client";

import Link from "next/link";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";
import { useAuthStore } from "@/store/auth-store";

const HeroSection = () => {
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);
  const { accessToken } = useAuthStore();
  
  return (
    <div className="w-full flex flex-col items-center text-center px-4 py-20 sm:py-28">
      {/* Tiêu đề chính */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
        {t.heroTitle} <span className="text-sky-800">{t.heroTitleHighlight}</span>{" "}
        {t.heroTitleSuffix}
      </h1>

      {/* Mô tả ngắn */}
      <p className="max-w-2xl mt-4 text-lg sm:text-xl text-gray-200">
        {t.heroDescription}
      </p>

      {/* Các nút tham gia cuộc thi */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 items-center mt-8">
        <Link href="/contests" className="cursor-pointer">
          <div className="flex max-w-60 h-12 px-4 gap-2 rounded-xl items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white sm:h-14">
            <svg viewBox="0 0 24 24" className="w-5 sm:w-7" fill="currentColor">
              <path d="M12 2L3.09 8.26L12 22L20.91 8.26L12 2ZM12 4.44L18.18 9L12 19.56L5.82 9L12 4.44Z"/>
            </svg>
            <div>
              <div className="text-xs sm:text-sm text-left">{t.joinCompetition}</div>
              <div className="text-sm font-semibold font-sans -mt-1 sm:text-lg">{t.competitionPainting}</div>
            </div>
          </div>
        </Link>
        <a href="/gallery" className="cursor-pointer">
          <div className="flex max-w-60 h-12 px-4 gap-2 rounded-xl items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white sm:gap-3 sm:h-14">
            <svg viewBox="0 0 24 24" className="w-5 sm:w-7" fill="currentColor">
              <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"/>
            </svg>
            <div>
              <div className="text-xs sm:text-sm text-left">{t.exploreGallery}</div>
              <div className="text-sm font-semibold font-sans -mt-1 sm:text-lg">{t.exhibition}</div>
            </div>
          </div>
        </a>
      </div>
      {!accessToken ? (
        <div className="relative inline-flex items-center justify-center gap-4 group mt-6">
          <div className="absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
          <a role="button" className="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30" title="register" href="/auth">
            {t.registerArtistFree}
            <svg aria-hidden="true" viewBox="0 0 10 10" height="10" width="10" fill="none" className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2">
              <path d="M0 5h7" className="transition opacity-0 group-hover:opacity-100"></path>
              <path d="M1 1l4 4-4 4" className="transition group-hover:translate-x-[3px]"></path>
            </svg>
          </a>
        </div>
      ) : (
        <div className="mt-8 flex items-center justify-center w-full max-w-md">
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-full"></div>
          <div className="mx-4 text-white/60 text-sm font-medium whitespace-nowrap">
            ✨
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-full"></div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;