"use client";
import React from "react";

const onboardingData = [
  {
    id: "rizz",
    title: "Rizz",
    description:
      "Tại RIZZ, chúng tôi tin rằng các mối quan hệ có ý nghĩa được xây dựng trên sự tin tưởng và kết nối thực sự...",
  },
  {
    id: "matches",
    title: "Matches",
    description:
      "Sự kết hợp hoàn hảo không phải chỉ là vẻ ngoài. Thuật toán của chúng tôi phân tích các sở thích, đam mê...",
  },
  {
    id: "premium",
    title: "Premium",
    description:
      "Nâng cấp trải nghiệm tìm kiếm người ấy của bạn với RIZZ Premium. Tận hưởng các đặc quyền độc quyền...",
  },
];

const OnboardingFeatures = () => {
  return (
    <div className="w-full mt-20 space-y-16">
      {onboardingData.map((section, index) => (
        <section
          key={section.id}
          className={`flex flex-col md:flex-row items-center justify-center min-h-screen p-8 rounded-3xl shadow-xl 
                     backdrop-blur-sm bg-black/40 border border-white/10 transition-colors duration-500 ease-in-out
                     ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
        >
          {/* SVG / Hình minh họa */}
          <div className="flex-1 w-full flex items-center justify-center p-8">
            {section.id === "rizz" && (
              <div className="relative w-full h-auto max-w-[20rem]">
                <svg className="w-full h-auto" viewBox="0 0 500 250">
                  <path
                    d="M50 200 Q 250 50, 450 200"
                    fill="transparent"
                    stroke="#ffffff80"
                    strokeWidth="15"
                    strokeLinecap="round"
                  />
                  <path
                    d="M50 200 A 200 200 0 0 1 120 100"
                    fill="transparent"
                    stroke="#fbb6ce"
                    strokeWidth="15"
                    strokeLinecap="round"
                  />
                  <g>
                    <circle cx="250" cy="200" r="15" fill="#fff" />
                    <path d="M250 200 L 250 50" stroke="#fff" strokeWidth="5" />
                    <polygon points="250,50 240,65 260,65" fill="#fff" />
                  </g>
                </svg>
              </div>
            )}

            {section.id === "matches" && (
              <div className="matches-image w-full h-[60%] rounded-3xl overflow-hidden relative max-w-lg">
                <div className="absolute top-0 w-full h-full flex items-center justify-center p-4">
                  <div className="matches-card w-40 h-56 rounded-3xl bg-gray-300/40 transform -rotate-12 translate-x-16 border border-white/10" />
                  <div className="matches-card w-48 h-64 rounded-3xl bg-gray-300/40 transform -translate-x-12 border border-white/10" />
                  <div className="matches-card w-40 h-56 rounded-3xl bg-gray-300/40 transform rotate-12 -translate-x-16 border border-white/10" />
                </div>
                <img
                  src="https://placehold.co/400x500/F0F0F0/000000?text=Placeholder"
                  alt="Placeholder for Matches"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            )}

            {section.id === "premium" && (
              <div className="relative premium-heart w-full max-w-[15rem] h-auto flex justify-center items-center">
                <svg className="w-full h-auto" viewBox="0 0 240 240">
                  <path
                    d="M120 216.7c-21.4-23.8-106.7-111.4-106.7-142.2 0-36.6 28.1-66.5 62.7-66.5 
                       22.8 0 43 12.3 54 30.5 11-18.2 31.2-30.5 54-30.5 34.6 0 62.7 29.9 
                       62.7 66.5 0 30.8-85.3 118.4-106.7 142.2z"
                    fill="#f472b6"
                    stroke="#ffffff80"
                    strokeWidth="2"
                  />
                  <path
                    d="M60 70 A 10 10 0 0 1 70 60 L 170 60 A 10 10 0 0 1 180 70 
                       L 180 170 A 10 10 0 0 1 170 180 L 70 180 A 10 10 0 0 1 60 170 Z"
                    fill="transparent"
                    stroke="#fbb6ce"
                    strokeWidth="4"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Nội dung */}
          <div className="flex-1 w-full max-w-2xl flex flex-col items-center text-center p-8">
            <h1
              className={`text-3xl md:text-5xl font-bold text-transparent bg-clip-text 
                          bg-gradient-to-r from-pink-200 via-purple-300 to-pink-100 mb-4`}
            >
              {section.title}
            </h1>
            <p className="text-gray-100 max-w-lg">{section.description}</p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default OnboardingFeatures;
