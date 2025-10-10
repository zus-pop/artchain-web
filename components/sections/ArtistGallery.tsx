"use client";

import React from "react";
import Image from "next/image";
import { useLanguageStore } from "@/store/language-store";
import { useTranslation } from "@/lib/i18n";

const ArtistGallery = () => {
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  const paintings = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop",
      description: t.sunsetOverRiver,
      title: "Nguyễn Văn A",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=500&fit=crop",
      description: t.portraitOfGirl,
      title: "Trần Thị B",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop",
      description: t.abstractArt,
      title: "Lê Văn C",
    },
    {
      id: 4,
      title: "DuongCongSon",
      price: "$35.00",
      image:
        "https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=500&auto=format&fit=crop",
      description: "Elegant portrait with flowers",
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Our <span className="text-red-500">Paintings</span>
          </h2>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">OUR PRODUCTS</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {paintings.map((painting) => (
            <div
              key={painting.id}
              className="overflow-hidden group shadow-lg"
            >
              {/* Product Image */}
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={painting.image}
                  alt={painting.description}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width={400}
                  height={500}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <button className="bg-white text-gray-800 py-2 px-6 rounded-full font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-200">
                    Add To Cart
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 text-center bg-white">
                <h3 className="font-serif text-xl font-semibold text-gray-800 mb-2">
                  {painting.title}
                </h3>
                {/* <p className="text-red-500 font-bold text-lg">
                  {painting.price}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistGallery;
