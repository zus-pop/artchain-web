"use client";

import React from "react";
import GlassSurface from "@/components/GlassSurface";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const ArrowRightIcon = () => <span>&rarr;</span>;

// Animated Container Component
const AnimatedContainer = ({
  children,
  className = "",
  animation = "animate-fade-in-up",
  delay = 0,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${className} ${isIntersecting ? animation : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
};

const CampaignCard = ({
  imgSrc,
  title,
  description,
}: {
  imgSrc: string;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col">
    <img
      src={imgSrc}
      alt={title}
      className="w-full aspect-4/3 object-cover mb-4 sm:mb-6"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://placehold.co/400x300/cccccc/333333?text=Image+Failed";
      }}
    />
    <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
    <p 
      className="text-black text-sm leading-relaxed mb-6 text-center" 
      dangerouslySetInnerHTML={{ __html: description }} 

    />
    <button className="w-full bg-[#FF6E1A] text-white px-4 py-2.5 font-medium text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
      Đăng kí tài trợ <ArrowRightIcon />
    </button>
  </div>
);

// Component Card cho Tin tức nhỏ
const NewsCardSmall = ({
  imgSrc,
  category,
  title,
  darkBg = false,
}: {
  imgSrc: string;
  category: string;
  title: string;
  darkBg?: boolean;
}) => (
  <div
    className={`flex flex-col overflow-hidden ${
      darkBg ? "bg-[#EAE6E0] text-black" : "bg-white text-black"
    }`}
  >
    <img
      src={imgSrc}
      alt={title}
      className="w-full h-32 sm:h-40 object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://placehold.co/300x160/cccccc/333333?text=Image";
      }}
    />
    <div className="p-3 sm:p-4">
      <p className="text-[10px] sm:text-xs font-semibold text-black uppercase mb-1">
        {category}
      </p>
      <h4
        className="text-sm sm:text-base font-semibold"
        dangerouslySetInnerHTML={{ __html: title }}
      />
    </div>
  </div>
);

// --- Component Chính Của Trang ---
export default function Page() {
  const navItems = [
    "Trang chủ",
    "Cuộc thi",
    "Triển lãm",
    "Bài viết",
    "Chiến dịch",
  ];

  return (
    <div className="min-h-screen bg-[#EAE6E0] text-black font-[family-name:var(--font-be-vietnam-pro)]">
      
      {/* --- Header --- */}
      <div className="fixed top-2 sm:top-5 left-2 sm:left-4 right-2 sm:right-4 lg:left-0 lg:right-0 z-50 flex justify-center">
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={50}
          backgroundOpacity={0.58}
          blur={5}
          saturation={3}
          brightness={54}
          opacity={1}
          displace={0.5}
          distortionScale={-180}
          redOffset={0}
          greenOffset={10}
          blueOffset={20}
          className="max-w-7xl w-full"
          style={{ justifyContent: "flex-start" }}
        >
          <div className="w-full px-3 sm:px-6 lg:px-16 flex justify-between items-center gap-2 sm:gap-3">
            <img
              src="/images/newlogo.png"
              alt="Artchain Logo"
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0"
            />
            <nav className="hidden lg:flex gap-6">
              {navItems.map((item, index) => (
                <a
                  key={item}
                  href="#"
                  className={`text-sm font-medium whitespace-nowrap ${index === 0 ? 'text-black border-b-2 border-black pb-1' : 'text-black hover:text-black'} transition-colors`}
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button className="lg:hidden p-2 text-black hover:text-black">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <button className="hidden sm:block bg-black text-white px-3 sm:px-4 lg:px-5 py-2 lg:py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">
              Tham gia ngay
            </button>
          </div>
        </GlassSurface>
      </div>

      <main>
        {/* --- Hero Section --- */}
        <section className="relative h-screen min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center text-white pt-16 sm:pt-20">
          <div className="absolute inset-0">
            <img
              src="https://res.cloudinary.com/dbke1s5nm/image/upload/v1762177079/herosection_jznhnz.png"
              alt="Nền bức tranh phong cảnh"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.backgroundColor =
                  "#6c7a89";
              }}
            />
          </div>

          <div className="relative z-5 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full">
            <div className="max-w-xl mt-0 sm:mt-[-10vh] lg:mt-[-17vh]">
              <AnimatedContainer
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#423137] font-semibold tracking-tighter leading-tight sm:leading-tight"
                animation="animate-fade-in-down"
              >
                CUỘC THI <br />
                NÉT VẼ XANH <br />
                2025
              </AnimatedContainer>
              <AnimatedContainer
                className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-black leading-relaxed"
                animation="animate-fade-in-up"
                delay={200}
              >
                Gửi gắm những câu chuyện, ý tưởng và khát{" "}
                <br className="hidden sm:inline" />
                vọng qua màu sắc độc đáo của riêng mình. Nơi{" "}
                <br className="hidden sm:inline" />
                tài năng hội họa của bạn được tỏa sáng.
              </AnimatedContainer>
              <AnimatedContainer
                className="mt-6 sm:mt-10"
                animation="animate-zoom-in"
                delay={400}
              >
                <button className="bg-[#FF6E1A] text-white px-6 sm:px-8 py-3 sm:py-4 font-medium text-sm sm:text-base hover:bg-gray-800 transition-colors flex items-center gap-2">
                  Xem Triển Lãm <ArrowRightIcon />
                </button>
              </AnimatedContainer>
            </div>
          </div>
        </section>

        {/* --- Contest Info Section --- */}
        <AnimatedContainer
          className="min-h-screen bg-[#EAE6E0] flex items-center justify-center py-12 sm:py-20 md:py-32 overflow-x-hidden"
          animation="animate-fade-in-left"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div className="max-w-lg">
              <h2 className="text-sm sm:text-base font-semibold text-black mb-2">
                Cuộc thi đang diễn ra
              </h2>
              <h3 className="text-3xl text-[#423137] sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                Thành Phố Trong <br />
                Mắt Em
              </h3>
              <p className="text-sm sm:text-base text-black leading-relaxed mb-4 sm:mb-6">
                &quot;Thành Phố Trong Mắt Em&quot; là cuộc thi vẽ tranh dành cho
                học sinh lớp 1–9 tại TP.HCM, nơi các em thể hiện góc nhìn và ước
                mơ về thành phố bằng màu sắc sáng tạo.
              </p>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-black">
                <p>
                  <strong>Thời gian:</strong> 21-10-2025 đến 12-12-2025
                </p>
                <p>
                  <strong>Lưu ý:</strong> Thí sinh cần nộp bản cứng tác phẩm
                  trước ngày 30-04-1974
                </p>
              </div>
              <button className="mt-6 sm:mt-10 bg-[#FF6E1A] text-white px-6 sm:px-8 py-3 sm:py-4 font-medium text-sm sm:text-base hover:bg-gray-800 transition-colors flex items-center gap-2">
                Tham gia ngay <ArrowRightIcon />
              </button>
            </div>

            <div className="h-64 sm:h-80 md:h-full  overflow-hidden md:-mr-[calc((100vw-72rem)/2+2rem)]">
              <img
                src="https://plus.unsplash.com/premium_vector-1697729767007-36c5a80b5782?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2910"
                alt="Minh họa thành phố"
                className="h-full w-full object-cover md:w-[50vw] max-w-none "
                onError={(e) => {
                  (e.target as HTMLImageElement).style.backgroundColor =
                    "#89c4f4";
                }}
              />
            </div>
          </div>
        </AnimatedContainer>

        {/* --- News Section with 3 Columns --- */}
        <AnimatedContainer
          className="min-h-screen bg-[#EAE6E0] text-white flex items-center justify-center py-12 sm:py-20 md:py-32"
          animation="animate-zoom-in"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full">
            <AnimatedContainer
              className="text-sm text-black sm:text-base font-semibold mb-4 sm:mb-6"
              animation="animate-fade-in-down"
            >
              Tin tức nổi bật
            </AnimatedContainer>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2px_1.2fr_2px_1fr] gap-6 sm:gap-8">
              <div className="flex flex-col justify-between gap-6 sm:gap-8">
                <NewsCardSmall
                  imgSrc="https://placehold.co/300x160/7F00FF/ffffff?text=Cactus+Art"
                  category="Digital & Contemparary Art"
                  title="How Art Fairs Are Adapting to the<br />Digital Age"
                  darkBg={true}
                />
                <NewsCardSmall
                  imgSrc="https://placehold.co/300x160/5C7C3B/ffffff?text=Painting"
                  category="Digital & Contemparary Art"
                  title="How Art Fairs Are Adapting to the<br />Digital Age"
                  darkBg={true}
                />
              </div>

              <div className="hidden lg:block w-0.5 bg-neutral-700 h-full"></div>

              <div className="flex flex-col bg-[#EAE6E0] text-white">
                <img
                  src="https://placehold.co/600x400/FF5733/ffffff?text=Paint+Brushes"
                  alt="Spotlight To Emerging Artist"
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover mb-4 sm:mb-6"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.backgroundColor =
                      "#FF5733";
                  }}
                />
                <AnimatedContainer
                  className="text-xs sm:text-sm font-semibold text-black uppercase mb-2"
                  animation="animate-fade-in-left"
                >
                  Artist Spotlight
                </AnimatedContainer>
                <AnimatedContainer
                  className="text-2xl sm:text-3xl font-bold mb-3 text-black sm:mb-4"
                  animation="animate-fade-in-right"
                  delay={200}
                >
                  Spotlight To Emerging Artist: Ones 
                  to watch in 2025
                </AnimatedContainer>
                <AnimatedContainer
                  className="text-sm sm:text-base text-black leading-relaxed"
                  animation="animate-fade-in-up"
                  delay={400}
                >
                  &quot;Thành Phố Trong Mắt Em&quot; là cuộc thi vẽ tranh dành cho 
                  học sinh từ lớp 1 đến lớp 9 đang học tập tại Thành phố 
                  Hồ Chí Minh. Cuộc thi khuyến khích các em thể hiện góc 
                  nhìn riêng về thành phố qua màu sắc, đường nét và trí...
                </AnimatedContainer>
              </div>

              <div className="hidden lg:block w-0.5 bg-neutral-700 h-full"></div>

              <div className="flex flex-col justify-between gap-6 sm:gap-8">
                <NewsCardSmall
                  imgSrc="https://placehold.co/300x160/7F00FF/ffffff?text=Cactus+Art"
                  category="Digital & Contemparary Art"
                  title="How Art Fairs Are Adapting to the<br />Digital Age"
                  darkBg={true}
                />
                <NewsCardSmall
                  imgSrc="https://placehold.co/300x160/5C7C3B/ffffff?text=Painting"
                  category="Digital & Contemparary Art"
                  title="How Art Fairs Are Adapting to the<br />Digital Age"
                  darkBg={true}
                />
              </div>
            </div>
          </div>
        </AnimatedContainer>

        {/* --- Campaigns Section --- */}
        <AnimatedContainer
          className="min-h-screen bg-[#EAE6E0] flex items-center justify-center py-12 sm:py-20 md:py-32"
          animation="animate-fade-in-right"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
            <AnimatedContainer
              className="text-sm sm:text-base font-semibold mb-4 sm:mb-6 text-black"
              animation="animate-fade-in-down"
            >
              Chiến dịch đang diễn ra
            </AnimatedContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
              <CampaignCard
                imgSrc="https://placehold.co/400x300/2ecc71/ffffff?text=Campaign+1"
                title="Gieo Mầm Tài Năng Trẻ"
                description="Mục tiêu gây quỹ để mua vật liệu vẽ<br />chất lượng và tổ chức các buổi<br />workshop miễn phí cho thí sinh."
              />
              <CampaignCard
                imgSrc="https://placehold.co/400x300/f1c40f/ffffff?text=Campaign+2"
                title="Tiếp Sức Nét Cọ"
                description="Kêu gọi cộng đồng hỗ trợ kinh phí in<br />ấn, trưng bày tác phẩm tại triển lãm<br />cuối cuộc thi."
              />
              <CampaignCard
                imgSrc="https://placehold.co/400x300/e74c3c/ffffff?text=Campaign+3"
                title="Mơ Ước Màu Nước"
                description="Mục tiêu gây quỹ nhỏ nhằm cung cấp<br />dụng cụ vẽ cho các thí sinh có hoàn<br />cảnh khó khăn tham gia."
              />
            </div>
          </div>
        </AnimatedContainer>
      </main>

      {/* --- Footer --- */}
      <footer className="py-8 sm:py-12 md:py-16 bg-black text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h5 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">
              Về chúng tôi
            </h5>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Nhiệm vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Đội ngũ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">
              Cuộc thi
            </h5>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Nét Vẽ Xanh 2025
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Thể lệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Nộp bài
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">
              Pháp lý
            </h5>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">
              Theo dõi
            </h5>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Youtube
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mt-8 sm:mt-12 border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
          <p>&copy; 2025 Cuộc Thi Nét Vẽ Xanh. Đã đăng ký bản quyền.</p>
        </div>
      </footer>
    </div>
  );
}
