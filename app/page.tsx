import Header2 from "@/components/mvpblocks/header-2";
import FooterGlow from "@/components/mvpblocks/footer-glow";

import HeroSection from "@/components/sections/HeroSection";
import MockupSection from "@/components/sections/MockupSection";
import OnboardingFeatures from "@/components/sections/OnboardingFeatures";

export default function Home() {
  return (
    // Bỏ đi grid layout cũ để các section có thể chiếm toàn bộ chiều rộng
    <div className="font-sans min-h-screen">
      <Header2 />

      <main className="flex flex-col items-center text-center w-full">
        {/* Phần Hero Section chứa tiêu đề, mô tả và các nút tải */}
        <HeroSection />
        {/* Phần Mockup hiển thị giao diện web và mobile */}
        <MockupSection />

        {/* Phần giới thiệu tính năng chi tiết (từ OnboardingScreen) */}
        <OnboardingFeatures />
      </main>

      <FooterGlow />
    </div>
  );
}
