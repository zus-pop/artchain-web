"use client";

import ArtistHeroSection from "@/components/sections/ArtistHeroSection";
import ArtistNavigation from "@/components/sections/ArtistNavigation";
import ArtistGallery from "@/components/sections/ArtistGallery";
import ContestShowcase from "@/components/sections/CompetitionShowcase";
import TabPanel from "@/components/sections/TabPanel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="h-[66vh] flex items-center justify-center relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%%3D%3D&auto=format&fit=crop&w=2058&q=80')`,
        }}
      >
        <ArtistHeroSection />
      </div>

      <div className="flex-1 bg-gray-100">
        <ArtistNavigation defaultTab={0}>
          {/* Home Tab */}
          <TabPanel className="container px-4 py-8">
            <ContestShowcase />
            <ArtistGallery />
          </TabPanel>

          {/* Contests Tab */}
          <TabPanel className="container px-4 py-8">
            <ContestShowcase />
            <ContestShowcase />
          </TabPanel>

          {/* Gallery Tab */}
          <TabPanel className="container px-4 py-8">
            <ArtistGallery />
            <ArtistGallery />
            <ArtistGallery />
          </TabPanel>

          {/* Prizes Tab */}
          <TabPanel className="container px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-2">First Prize</h3>
                <p className="text-gray-600">$10,000 + Trophy</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-2">Second Prize</h3>
                <p className="text-gray-600">$5,000 + Certificate</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-2">Third Prize</h3>
                <p className="text-gray-600">$2,500 + Certificate</p>
              </div>
            </div>
          </TabPanel>
        </ArtistNavigation>
      </div>
    </div>
  );
}
