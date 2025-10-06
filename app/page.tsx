import ArtistHeroSection from "@/components/sections/ArtistHeroSection";
import ArtistNavigation from "@/components/sections/ArtistNavigation";
import ArtistGallery from "@/components/sections/ArtistGallery";
import ContestShowcase from "@/components/sections/CompetitionShowcase";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div
        className="h-2/3 flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%%3D%3D&auto=format&fit=crop&w=2058&q=80')`,
        }}
      >
        <ArtistHeroSection />
      </div>
      <div className="h-1/3 bg-gray-100">
      <ArtistNavigation />
      <ContestShowcase />
      <ArtistGallery />
      <ArtistGallery />
      <ArtistGallery />
      </div>
    </div>
  );
}
