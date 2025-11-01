'use client'; // Cần cho useState và useEffect

import React, { useState, useEffect } from 'react';
import { Menu, Facebook, Twitter, Instagram, PenTool, Dribbble, ArrowUp, Check } from 'lucide-react'; // Thêm icon Check

/**
 * Component helper cho icon mạng xã hội
 */
const IconWrapper = ({ href = "#", children }: { href?: string, children: React.ReactNode }) => (
  <a
    href={href}
    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white/70
               hover:bg-white hover:text-black hover:border-white
               transition-all duration-300"
    aria-label="Social media link"
  >
    {children}
  </a>
);

/**
 * Component helper cho các mục thống kê
 */
const StatItem = ({ number, label }: { number: string, label: string }) => (
  <div className="flex flex-col items-center text-center">
    <span className="text-5xl sm:text-6xl font-bold mb-2 text-white">
      {number}
    </span>
    <span className="text-sm font-medium tracking-widest uppercase text-white/90">
      {label}
    </span>
  </div>
);

/**
 * Component chính của trang, mô phỏng theo thiết kế "Glint"
 */
export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Hiển thị nút "Scroll to Top" khi cuộn xuống
  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScrollTop]);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // Wrapper chính của trang, cho phép cuộn
    <div className="relative w-full font-sans bg-black">
      
      {/* Section 1: Hero */}
      <section className="relative h-screen w-full text-white overflow-hidden">
        {/* 1. Lớp hình nền */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h-750&dpr=2')"
          }}
        />

        {/* 2. Lớp phủ màu tối */}
        <div className="absolute inset-0 bg-black/70 bg-blend-multiply"></div>

        {/* 3. Lớp nội dung */}
        <div className="relative z-10 flex flex-col h-full">

          {/* Header */}
          <header className="flex justify-between items-center p-8 md:p-12">
            <h1 className="text-3xl font-bold tracking-tight cursor-pointer">
              Glint.
            </h1>
            <button className="flex items-center space-x-3 group">
              <span className="text-sm font-medium tracking-widest uppercase group-hover:text-gray-300 transition-colors">
                Menu
              </span>
              <Menu className="w-6 h-6 group-hover:text-gray-300 transition-colors" />
            </button>
          </header>

          {/* Nội dung chính */}
          <main className="flex-grow flex items-center px-8 md:px-12 lg:px-24">
            <div className="max-w-2xl">
              <p className="text-sm font-medium tracking-[0.3em] uppercase text-gray-300 mb-6">
                WELCOME TO GLINT
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-10 text-shadow-lg">
                We are a creative group of people who design influential brands and digital experiences.
              </h2>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="px-8 py-4 border-2 border-white text-sm font-bold tracking-widest uppercase 
                                   hover:bg-white hover:text-black transition-all duration-300">
                  START A PROJECT
                </button>
                <button className="px-8 py-4 border-2 border-white text-sm font-bold tracking-widest uppercase
                                   hover:bg-white hover:text-black transition-all duration-300">
                  MORE ABOUT US
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* Sidebar Icon Mạng xã hội */}
        <aside className="absolute z-10 right-8 md:right-12 top-1/2 -translate-y-1/2 flex flex-col space-y-5">
          <IconWrapper><Facebook className="w-4 h-4" /></IconWrapper>
          <IconWrapper><Twitter className="w-4 h-4" /></IconWrapper>
          <IconWrapper><Instagram className="w-4 h-4" /></IconWrapper>
          <IconWrapper><PenTool className="w-4 h-4" /></IconWrapper>
          <IconWrapper><Dribbble className="w-4 h-4" /></IconWrapper>
        </aside>

        {/* Chỉ báo "Scroll Down" - Cập nhật style theo hình ảnh mới */}
        <a
          href="#about-glint"
          className="absolute z-10 bottom-8 right-8 md:right-12 flex items-baseline space-x-6 cursor-pointer group"
          aria-label="Scroll to next section"
        >
          {/* Phần text + checkmark */}
          <div className="flex items-center space-x-2">
            {/* Icon check màu xanh lá cây */}
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium tracking-widest uppercase text-white/70 group-hover:text-white transition-colors">
              SCROLL DOWN
            </span>
          </div>
          
          {/* Thanh nối dọc bắt đầu từ đây và kéo dài xuống */}
          {/* Vị trí của thanh này sẽ được điều chỉnh bởi div chứa nó ở ngay bên ngoài section */}
        </a>
      </section>

      {/* Thanh nối liền giữa các section */}
      {/* Đây là thanh dọc trắng, cố định ở bên phải,
          nằm ngoài các section để có thể nối liền chúng.
          Vị trí 'top-1/2' và 'h-1/2' giúp nó bắt đầu từ giữa trang và kéo xuống dưới,
          sau đó 'bottom-0' của nó sẽ kéo dài tới hết trang.
          Điều chỉnh 'height' và 'top' để khớp với điểm bắt đầu và kết thúc mong muốn.
          Giá trị 'top' cần khớp với vị trí của 'SCROLL DOWN'
      */}
      <div className="absolute top-[calc(100vh_-_8rem)] right-[calc(2rem_+_2px)] md:right-[calc(3rem_+_2px)] w-0.5 bg-white z-20"
           style={{ height: `calc(100% - (100vh - 8rem))` }}>
        {/*
          Giải thích:
          - `right-[calc(2rem_+_2px)]`: (right-8) = 2rem. 2px là để căn giữa với đường thẳng của SCROLL DOWN
          - `top-[calc(100vh_-_8rem)]`: 100vh là chiều cao của viewport. 8rem là khoảng cách từ dưới lên của SCROLL DOWN (bottom-8).
            Vậy thanh này sẽ bắt đầu từ điểm cuối của SCROLL DOWN.
          - `height: calc(100% - (100vh - 8rem))`: Chiều cao của toàn bộ tài liệu trừ đi chiều cao của phần trên.
            Điều này cho phép nó kéo dài xuống phần còn lại của trang.
        */}
      </div>


      {/* Section 2: About (We Are Glint) */}
      <section id="about-glint" className="py-20 md:py-32" style={{ backgroundColor: '#39b54a' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-black mb-6">
            HELLO THERE
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-10">
            We Are Glint
          </h2>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-16 md:mb-24 max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem number="127" label="Awards Received" />
            <StatItem number="1505" label="Cups of Coffee" />
            <StatItem number="109" label="Projects Completed" />
            <StatItem number="102" label="Happy Clients" />
          </div>
        </div>
      </section>

      {/* Nút "Scroll to Top" */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center
                    shadow-lg transition-opacity duration-300 z-50
                    ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* Thêm một section footer giả để thấy nút scroll-to-top rõ hơn */}
      <footer className="h-40 bg-black"></footer>
    </div>
  );
}

