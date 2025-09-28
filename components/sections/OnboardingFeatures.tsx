"use client";
import React from "react";

const onboardingData = [
  {
    id: "contests",
    title: "Cuộc Thi",
    description:
      "Tham gia các cuộc thi vẽ tranh đa dạng với nhiều chủ đề hấp dẫn. Thể hiện tài năng nghệ thuật của bạn và cạnh tranh với các nghệ sĩ tài năng từ khắp nơi trên thế giới.",
  },
  {
    id: "gallery",
    title: "Triển Lãm",
    description:
      "Khám phá bộ sưu tập nghệ thuật phong phú từ cộng đồng nghệ sĩ. Tìm hiểu các kỹ thuật vẽ mới và lấy cảm hứng từ những tác phẩm xuất sắc nhất.",
  },
  {
    id: "rewards",
    title: "Giải Thưởng",
    description:
      "Nhận những phần thưởng giá trị khi tham gia cuộc thi. Từ giải thưởng tiền mặt, chứng nhận nghệ thuật đến cơ hội triển lãm tác phẩm tại các gallery nổi tiếng.",
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
            {section.id === "contests" && (
              <div className="relative w-full h-auto max-w-[20rem]">
                <svg className="w-full h-auto" viewBox="0 0 400 300">
                  {/* Trophy base */}
                  <rect x="160" y="220" width="80" height="40" rx="5" fill="#FFD700" />
                  <rect x="150" y="260" width="100" height="20" rx="10" fill="#B8860B" />
                  
                  {/* Trophy cup */}
                  <ellipse cx="200" cy="160" rx="60" ry="40" fill="#FFD700" stroke="#FFA500" strokeWidth="3" />
                  <ellipse cx="200" cy="150" rx="50" ry="30" fill="#FFE55C" />
                  
                  {/* Trophy handles */}
                  <path d="M140 140 Q 120 140, 120 160 Q 120 180, 140 180" 
                        fill="transparent" stroke="#FFD700" strokeWidth="8" strokeLinecap="round" />
                  <path d="M260 140 Q 280 140, 280 160 Q 280 180, 260 180" 
                        fill="transparent" stroke="#FFD700" strokeWidth="8" strokeLinecap="round" />
                  
                  {/* Sparkles */}
                  <g fill="#FFFFFF">
                    <circle cx="120" cy="100" r="3" />
                    <circle cx="280" cy="120" r="2" />
                    <circle cx="100" cy="180" r="2" />
                    <circle cx="320" cy="80" r="3" />
                  </g>
                </svg>
              </div>
            )}

            {section.id === "gallery" && (
              <div className="gallery-frames w-full h-[60%] rounded-3xl overflow-hidden relative max-w-lg">
                <div className="absolute top-0 w-full h-full flex items-center justify-center p-4">
                  <div className="frame w-32 h-40 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 transform -rotate-12 translate-x-12 border-4 border-white shadow-lg" />
                  <div className="frame w-40 h-48 rounded-2xl bg-gradient-to-br from-blue-400 to-teal-400 transform -translate-x-8 border-4 border-white shadow-xl z-10" />
                  <div className="frame w-32 h-40 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 transform rotate-12 -translate-x-12 border-4 border-white shadow-lg" />
                </div>
              </div>
            )}

            {section.id === "rewards" && (
              <div className="relative reward-icon w-full max-w-[15rem] h-auto flex justify-center items-center">
                <svg className="w-full h-auto" viewBox="0 0 300 300">
                  {/* Medal circle */}
                  <circle cx="150" cy="120" r="60" fill="#FFD700" stroke="#FFA500" strokeWidth="4" />
                  <circle cx="150" cy="120" r="45" fill="#FFE55C" />
                  
                  {/* Star in center */}
                  <path d="M150 85 L158 110 L185 110 L165 125 L172 150 L150 135 L128 150 L135 125 L115 110 L142 110 Z" 
                        fill="#FF6B6B" stroke="#FF4757" strokeWidth="2" />
                  
                  {/* Ribbon */}
                  <path d="M120 170 Q 120 190, 140 200 L 140 250 Q 145 255, 150 250 L 150 210 L 160 210 L 160 250 Q 155 255, 150 250 L 160 250 L 160 200 Q 180 190, 180 170" 
                        fill="#E74C3C" stroke="#C0392B" strokeWidth="2" />
                  
                  {/* Money symbols */}
                  <text x="80" y="50" fontSize="20" fill="#2ECC71">$</text>
                  <text x="220" y="70" fontSize="20" fill="#2ECC71">$</text>
                  <text x="50" y="180" fontSize="20" fill="#2ECC71">$</text>
                  <text x="250" y="200" fontSize="20" fill="#2ECC71">$</text>
                </svg>
              </div>
            )}
          </div>

          {/* Nội dung */}
          <div className="flex-1 w-full max-w-2xl flex flex-col items-center text-center p-8">
            <h1
              className={`text-3xl md:text-5xl font-bold text-transparent bg-clip-text 
                          bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 mb-4`}
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
