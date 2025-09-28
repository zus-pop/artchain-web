"use client";

import ArtFrame from "@/components/ArtFrame";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";

const MockupSection = () => {
    const { currentLanguage } = useLanguageStore();
    const t = useTranslation(currentLanguage);

    const artworks = [
        {
            src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop",
            title: t.sunsetOverRiver,
            artist: "Nguyễn Văn A",
            frameStyle: 'gold' as const
        },
        {
            src: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=500&fit=crop", 
            title: t.portraitOfGirl,
            artist: "Trần Thị B",
            frameStyle: 'silver' as const
        },
        {
            src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop",
            title: t.abstractArt,
            artist: "Lê Văn C", 
            frameStyle: 'modern' as const
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center w-full px-4 py-20 relative">
            {/* Title Section */}
            <div className="text-center mb-16 max-w-4xl mt-8">
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent mb-4">
                    {t.featuredExhibition}
                </h2>
                <p className="text-gray-100 text-lg md:text-xl leading-relaxed">
                    {t.featuredExhibitionDesc}
                </p>
            </div>

            {/* Art Gallery */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
                {artworks.map((artwork, index) => (
                    <div 
                        key={index}
                        className={`transform transition-transform duration-500 hover:scale-110 ${
                            index % 2 === 0 ? 'rotate-2' : '-rotate-2'
                        } hover:rotate-0`}
                    >
                        <ArtFrame
                            artworkSrc={artwork.src}
                            artworkTitle={artwork.title}
                            artistName={artwork.artist}
                            frameStyle={artwork.frameStyle}
                        />
                    </div>
                ))}
            </div>

            {/* View More Button */}
            <div className="text-center">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    {t.viewMoreArtworks}
                    <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default MockupSection;