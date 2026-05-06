"use client";

import React, { useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CircularGallery from "@/components/CircularGallery";
import { useGetExhibitions, useGetExhibitionById } from "@/apis/exhibition";
import { IconArrowLeft, IconChevronRight, IconPalette, IconCalendar, IconArtboard } from "@tabler/icons-react";
import Loader from "@/components/Loaders";
import GlassSurface from "@/components/GlassSurface";
import { InteractiveHeroButton } from "@/components/ui/InteractiveHeroButton";
import { useSearchParams, useRouter } from "next/navigation";

const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1596649300028-340ad0ec6146?q=80&w=2070&auto=format&fit=crop";

const ExhibitionCard = ({ exhibition }: { exhibition: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/exhibition?id=${exhibition.exhibitionId}`)}
      className="relative h-[500px] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg bg-white border border-[#e6e2da] group/ex-card"
    >
      {/* Background/Top Image Container */}
      <motion.div
        layout
        className="absolute inset-0 z-0"
        animate={{ 
          height: isHovered ? "55%" : "100%",
          borderRadius: isHovered ? "0 0 2rem 2rem" : "0px"
        }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <motion.img 
          layout
          src={exhibition.exhibitionPaintings?.[0]?.imageUrl || BACKGROUND_IMAGE} 
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          alt={exhibition.name}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"
          animate={{ opacity: isHovered ? 0 : 1 }}
        />
        <motion.div 
          className="absolute inset-0 bg-black/10"
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
      </motion.div>

      {/* Initial Content */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        animate={{ opacity: isHovered ? 0 : 1, y: isHovered ? -20 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-8 h-full flex flex-col justify-between text-white">
          <div className="max-w-[70%]">
            <h3 className="text-2xl font-bold leading-tight mb-1">{exhibition.name}</h3>
            {/* <p className="text-sm opacity-80 line-clamp-1">{exhibition.description}</p> */}
            <p className="text-sm opacity-80 line-clamp-1">{exhibition.numberOfPaintings} Tác Phẩm</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
            <div>
              <p className="text-lg font-bold"></p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hover Content */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-between bg-white z-20"
        initial={{ opacity: 0, y: 100 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          y: isHovered ? 0 : 100,
          height: isHovered ? "45%" : "0%" 
        }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <div>
          <h3 className="text-xl font-bold text-[#423137] mb-2">{exhibition.name}</h3>
          <p className="text-xs text-[#423137]/60 line-clamp-2 leading-relaxed">
            {exhibition.description}
          </p>
        </div>

        <div className="flex items-center mt-4 w-full group-hover/ex-card:[&_a]:text-white group-hover/ex-card:[&_a::before]:left-0 group-hover/ex-card:[&_a::before]:scale-150 group-hover/ex-card:[&_svg]:rotate-90 group-hover/ex-card:[&_svg]:bg-[var(--site-accent)] group-hover/ex-card:[&_svg]:border-none group-hover/ex-card:[&_path]:fill-white">
          <InteractiveHeroButton 
            label="Vào triển lãm"
            href={`/exhibition?id=${exhibition.exhibitionId}`}
            className="w-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

const ExhibitionContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedExhibitionId = searchParams.get("id");
  
  const { data: exhibitionsData, isLoading: isLoadingList } = useGetExhibitions();
  const { data: detailData, isLoading: isLoadingDetail } = useGetExhibitionById(selectedExhibitionId || "");

  // Disable page scroll when gallery is active
  useEffect(() => {
    if (selectedExhibitionId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedExhibitionId]);

  const activeExhibitions = exhibitionsData?.data.filter(ex => ex.status === "ACTIVE") || [];

  if (isLoadingList) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EAE6E0]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 w-full bg-[#EAE6E0] px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedExhibitionId ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="mb-16">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#423137] leading-[1.1] tracking-tight">
                  Không gian <br />
                  <span className="text-[#FF6E1A]">Triển lãm</span>
                </h1>
                <p className="mt-6 text-lg text-[#423137]/60 font-medium max-w-xl">
                  Trải nghiệm những tác phẩm nghệ thuật đỉnh cao trong không gian trưng bày kỹ thuật số độc đáo.
                </p>
              </div>

              {/* Exhibition Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {activeExhibitions.length > 0 ? (
                  activeExhibitions.map((ex) => (
                    <ExhibitionCard 
                      key={ex.exhibitionId} 
                      exhibition={ex} 
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-[#e6e2da]">
                    <p className="text-[#423137]/40 font-medium">Hiện tại chưa có triển lãm nào đang diễn ra.</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              {/* Back Button and Title */}
              {/* Centered Header with Back Button and 3D Action */}
              <div className="grid grid-cols-3 items-center mb-8 relative z-30">
                <div className="flex items-start">
                  <button
                    onClick={() => router.push("/exhibition")}
                    className="flex items-center gap-2 text-[#423137] font-bold hover:text-[#FF6E1A] transition-colors group"
                  >
                    <IconArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Quay lại
                  </button>
                </div>

                <div className="flex flex-col items-center text-center">
                  <h2 className="text-3xl font-bold text-[#423137]">{detailData?.data.name}</h2>
                  {/* <p className="text-sm text-[#423137]/60">Khám phá {detailData?.data.exhibitionPaintings.length} tác phẩm</p> */}
                </div>

                <div className="flex justify-end">
                  <InteractiveHeroButton 
                    label="Triển lãm 3D"
                    href={`/exhibition/${selectedExhibitionId}/3d`}
                  />
                </div>
              </div>

              {/* Gallery Loader / Content - Responsive height */}
              <div className="relative w-full overflow-hidden h-[75vh] -mt-24 sm:-mt-32 lg:-mt-36">
                {/* Side Overlays for Fade Effect */}
                <div className="absolute top-0 left-0 bottom-0 w-32 z-20 bg-gradient-to-r from-[#EAE6E0] to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 bottom-0 w-32 z-20 bg-gradient-to-l from-[#EAE6E0] to-transparent pointer-events-none" />

                {isLoadingDetail ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader />
                  </div>
                ) : (
                  <CircularGallery 
                    items={detailData?.data.exhibitionPaintings.map(p => ({
                      image: p.imageUrl,
                      text: `${p.competitor.fullName}\n${p.award?.name || ""}`
                    })) || []}
                    bend={3} 
                    textColor="#423137" 
                    borderRadius={0.05} 
                    scrollSpeed={2}
                    scrollEase={0.05}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ExhibitionPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#EAE6E0]">
        <Loader />
      </div>
    }>
      <ExhibitionContent />
    </Suspense>
  );
};

export default ExhibitionPage;
