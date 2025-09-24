"use client";

import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="w-full flex flex-col items-center text-center px-4 py-20 sm:py-28">
      {/* Tiêu đề chính */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
        Khám Phá <span className="text-pink-500">Người Ấy</span> Của Bạn Ngay
        Hôm Nay.
      </h1>

      {/* Mô tả ngắn */}
      <p className="max-w-2xl mt-4 text-lg sm:text-xl text-gray-300">
        Tham gia cộng đồng RIZZ WEB để kết nối với những người chân thành, bắt
        đầu những buổi hẹn hò tuyệt vời và xây dựng các mối quan hệ ý nghĩa.
        Câu chuyện tình yêu của bạn bắt đầu từ đây.
      </p>

      {/* Các nút tải ứng dụng */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 items-center mt-8">
        <a href="#" className="cursor-pointer">
          <div className="flex max-w-48 h-12 px-3 gap-2 rounded-xl items-center justify-center bg-black text-white dark:text-black dark:bg-white sm:h-14">
            <svg viewBox="30 336.7 120.9 129.2" className="w-5 sm:w-7">
              <path d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7 c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z" fill="#FFD400"></path>
              <path d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3 c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z" fill="#FF3333"></path>
              <path d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1 c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z" fill="#48FF48"></path>
              <path d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6 c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z" fill="#3BCCFF"></path>
            </svg>
            <div>
              <div className="text-[.5rem] sm:text-xs text-left">GET IT ON</div>
              <div className="text-sm font-semibold font-sans -mt-1 sm:text-xl">Google Play</div>
            </div>
          </div>
        </a>
        <a href="#" className="cursor-pointer">
          <div className="flex max-w-48 h-12 px-3 gap-2 rounded-xl items-center justify-center bg-black text-white dark:text-black dark:bg-white sm:gap-3 sm:h-14">
            <svg viewBox="0 0 384 512" className="w-5 sm:w-7">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" fill="currentColor"></path>
            </svg>
            <div>
              <div className="text-[.5rem] sm:text-xs text-left">Download on the</div>
              <div className="text-lg font-semibold font-sans -mt-1 sm:text-2xl">App Store</div>
            </div>
          </div>
        </a>
      </div>
      <div className="relative inline-flex items-center justify-center gap-4 group mt-6">
        <div className="absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
        <a role="button" className="group relative inline-flex items-center justify-center text-base rounded-xl bg-gray-900 px-8 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30" title="payment" href="#">
          Get Started For Free
          <svg aria-hidden="true" viewBox="0 0 10 10" height="10" width="10" fill="none" className="mt-0.5 ml-2 -mr-1 stroke-white stroke-2">
            <path d="M0 5h7" className="transition opacity-0 group-hover:opacity-100"></path>
            <path d="M1 1l4 4-4 4" className="transition group-hover:translate-x-[3px]"></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default HeroSection;