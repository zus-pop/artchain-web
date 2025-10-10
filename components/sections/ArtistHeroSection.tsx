"use client";

import React from "react";

const ArtistHeroSection = () => {
  return (
    <div className="h-2/3 flex flex-col">
      {/* Hero Section with Background Image - 2/3 Screen */}
      <div>
        {/* Contact Info Bar - Transparent with bottom border only */}
        <div className="absolute top-0 left-0 right-0 bg-transparent py-3 px-4 z-20">
          {/* <div className="max-w-6xl mx-auto flex justify-between items-center text-white/90 text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1">
                📧 sonduongcong8@gmail.com 
              </span>
              <span className="flex items-center gap-1">
                📞 0818954955
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-yellow-300 transition-colors">Facebook</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">Github</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">Pinterest</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">Email</a>
              <a href="#" className="hover:text-yellow-300 transition-colors">Instagram</a>
              <a href="/auth" className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white font-medium transition-colors">
                Join now
              </a>
            </div>
          </div> */}
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center px-4 mt-20 max-w-4xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
              We Deliver Best
              <br />
              <span className="text-yellow-300">Painting</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-3 font-light tracking-wide">
              INNOVATION, PERFECTION AND CREATIVITY
            </p>
            <p className="text-base md:text-lg mb-6 font-light">
              AT ITS BEST
            </p>

            <a href="/gallery" className="btn-primary inline-block text-base">
              Explore Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistHeroSection;

