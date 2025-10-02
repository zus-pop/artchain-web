import FooterGlow from "@/components/mvpblocks/footer-glow";

import HeroSection from "@/components/sections/HeroSection";
import MockupSection from "@/components/sections/MockupSection";
import OnboardingFeatures from "@/components/sections/OnboardingFeatures";
import ContestShowcase from "@/components/sections/CompetitionShowcase";
import StatsAndTestimonials from "@/components/sections/StatsAndTestimonials";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <div className="flex flex-col items-center text-center w-full">
        {/* Phần Hero Section chứa tiêu đề, mô tả và các nút tải */}
        <HeroSection />
        
        {/* Phần hiển thị các cuộc thi đang diễn ra */}
        <ContestShowcase />
        
        {/* Phần Mockup hiển thị giao diện web và mobile */}
        <MockupSection />

        {/* Phần giới thiệu tính năng chi tiết */}
        <OnboardingFeatures />
        
        {/* Phần thống kê và testimonials */}
        <StatsAndTestimonials />
      </div>

      <FooterGlow />
    </div>
  );
}
