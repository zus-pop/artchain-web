"use client"; // Cần cho useState và useEffect

import React, { useState, useEffect } from "react";
import {
  Menu,
  Facebook,
  Twitter,
  Instagram,
  PenTool,
  Dribbble,
  ArrowUp,
  Globe, 
  Link,
  Apple,
  Atom,
  Smartphone,
  Cloud,
  Droplet,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Mail,
  X,
  Share2
} from "lucide-react";
import GlassSurface from "@/components/GlassSurface"; 


const PrimaryButton = ({
  children,
  onClick,
  fullWidth = false,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: "default" | "large";
}) => {
  const baseClasses = "bg-black text-white rounded-[3px] font-medium hover:bg-gray-800 transition-all duration-300 inline-flex items-center justify-center gap-2";
  const sizeClasses = variant === "large" ? "px-14 py-6 text-xl" : "px-7 py-3.5 text-base";
  const widthClasses = fullWidth ? "w-full" : "";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${widthClasses}`}
    >
      {children}
      <ArrowRight className="w-5 h-5" />
    </button>
  );
};

const IconWrapper = ({
  href = "#",
  children,
  label,
}: {
  href?: string;
  children: React.ReactNode;
  label?: string;
}) => (
  <a
    href={href}
    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white/70
               hover:bg-white hover:text-black hover:border-white
               transition-all duration-300 relative group"
    aria-label={label || "Social media link"}
  >
    {children}
    {label && (
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-white text-black text-xs font-medium rounded
                       opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200
                       whitespace-nowrap">
        {label}
      </span>
    )}
  </a>
);

const ServiceItem = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex">
    <div className="pr-6">
      <Icon className="w-12 h-12 text-orange-700" />
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const PortfolioItem = ({
  src,
  alt,
  title,
  category,
  isLarge = false, // Prop để xác định ảnh lớn/nhỏ
}: {
  src: string;
  alt: string;
  title: string;
  category: string;
  isLarge?: boolean;
}) => {
  return (
    // FIX: h-[450px] áp dụng cho mọi kích thước (cả mobile và cửa sổ hẹp trên Mac)
    // Chỉ khi 'isLarge' và màn hình > md, nó mới đổi thành 900px
    <div
      className={`relative group overflow-hidden h-[450px] ${
        isLarge ? "md:h-[900px]" : ""
      }`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
        <a
          href="#"
          className="absolute top-4 right-4 text-white hover:text-orange-700 transition-colors"
        >
          <Link className="w-6 h-6" />
        </a>
        <h3 className="text-white text-xl font-semibold mb-2 mt-8">{title}</h3>
        <p className="text-gray-300 text-sm">{category}</p>
      </div>
    </div>
  );
};

const FormInput = ({
  type = "text",
  name,
  placeholder,
}: {
  type?: string;
  name: string;
  placeholder: string;
}) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full bg-transparent border-b border-gray-500/50 py-4 text-white
                 focus:outline-none focus:border-orange-700 transition-colors"
      required
    />
  </div>
);

const StatItem = ({ number, label }: { number: string; label: string }) => (
  <div className="flex flex-col items-center text-center">
    <span className="text-5xl sm:text-6xl font-bold mb-2 text-white">
      {number}
    </span>
    <span className="text-sm font-medium tracking-widest uppercase text-white/90">
      {label}
    </span>
  </div>
);

const FooterIconWrapper = ({
  href = "#",
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="text-white/50 hover:text-white transition-colors duration-300"
    aria-label="Social media link"
  >
    {children}
  </a>
);

const CompetitionCard = ({ imgSrc, title, description, date, note, reverse = false }: { 
  imgSrc: string; 
  title: string; 
  description: string; 
  date: string; 
  note: string; 
  reverse?: boolean; 
}) => (
  <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
    <div className="md:w-1/2">
      <h3 className="text-4xl md:text-5xl font-bold text-black mb-6 font-serif">{title}</h3>
      <p className="text-gray-700 mb-6 leading-relaxed text-lg">{description}</p>
      <div className="text-base text-gray-600 space-y-3">
        <p><strong className="text-black">Thời gian:</strong> {date}</p>
        <p><strong className="text-black">Lưu ý:</strong> {note}</p>
      </div>
      <button className="mt-8 w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-black text-white text-sm font-bold tracking-widest uppercase
                         hover:bg-gray-800 transition-all duration-300">
        <span>Tham gia ngay</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
    <div className={`
                    ${reverse ? 'md:-ml-[calc((100vw-72rem)/2+2rem)]' : 'md:-mr-[calc((100vw-72rem)/2+2rem)]'}
                   `}>
      <img 
        src={imgSrc} 
        alt={title} 
        className={`w-full h-auto object-cover md:w-[50vw] max-w-none 
                    ${reverse ? 'md:rounded-tr-2xl md:rounded-br-2xl' : 'md:rounded-tl-2xl md:rounded-bl-2xl'}
                   `} 
        onError={(e) => (e.currentTarget.src = 'https://placehold.co/800x600/a0d2eb/ffffff?text=Error')}
      />
    </div>
  </div>
);

export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSocialIcons, setShowSocialIcons] = useState(false); 

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScrollTop]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMenuLinkClick = (selector: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
    }, 300); 
  };

  const scrollToSection = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen relative bg-stone-200 overflow-x-hidden">
      {/* Section 1: Hero Section */}
      <section id="hero" className="relative w-full h-screen">
        <img 
          className="w-full h-full object-cover absolute inset-0" 
          src="https://res.cloudinary.com/dbke1s5nm/image/upload/v1762177079/herosection_jznhnz.png" 
          alt="Hero Background"
        />
        
        {/* Fixed Navigation Bar */}
        <nav className="fixed top-[5px] left-1/2 -translate-x-1/2 z-50 w-[80%]">
          <GlassSurface
            width="100%"
            height={80}
            borderRadius={33}
            backgroundOpacity={0}
            saturation={1}
            borderWidth={0.07}
            brightness={50}
            opacity={0.93}
            blur={9}
            displace={0.5}
            distortionScale={-180}
            redOffset={0}
            greenOffset={10}
            blueOffset={20}
            mixBlendMode="normal"
          >
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto flex justify-between items-center h-20">
                {/* Logo */}
                <div className="flex items-center">
                  <img className="w-16 h-16" src="/images/newlogo.png" alt="Logo" />
                </div>
                
                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-9">
                  <button 
                    onClick={() => scrollToSection('#hero')}
                    className="text-black text-lg font-normal hover:text-orange-700 transition-colors relative group"
                  >
                    Trang chủ
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-700 group-hover:w-full transition-all duration-300"></span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('#contests')}
                    className="text-black text-lg font-normal hover:text-orange-700 transition-colors relative group"
                  >
                    Cuộc thi
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-700 group-hover:w-full transition-all duration-300"></span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('#exhibition')}
                    className="text-black text-lg font-normal hover:text-orange-700 transition-colors relative group"
                  >
                    Triển lãm
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-700 group-hover:w-full transition-all duration-300"></span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('#news')}
                    className="text-black text-lg font-normal hover:text-orange-700 transition-colors relative group"
                  >
                    Bài viết
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-700 group-hover:w-full transition-all duration-300"></span>
                  </button>
                  <button 
                    onClick={() => scrollToSection('#campaigns')}
                    className="text-black text-lg font-normal hover:text-orange-700 transition-colors relative group"
                  >
                    Chiến dịch
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-700 group-hover:w-full transition-all duration-300"></span>
                  </button>
                </div>
                
                {/* CTA Button */}
                <PrimaryButton onClick={() => scrollToSection('#contests')}>
                  Tham gia ngay
                </PrimaryButton>
                
                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setIsMenuOpen(true)}
                  className="md:hidden p-2"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </GlassSurface>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold uppercase text-black mb-6 leading-tight">
                CUỘC THI<br/>
                NÉT VẼ XANH<br/>
                2025
              </h1>
              <p className="text-xl text-neutral-950 font-medium mb-12 max-w-lg">
                Gửi gắm những câu chuyện, ý tưởng và khát vọng qua màu sắc độc đáo của riêng mình. Nơi tài năng hội họa của bạn được tỏa sáng.
              </p>
              <PrimaryButton 
                onClick={() => scrollToSection('#exhibition')}
                variant="large"
              >
                Xem Triển Lãm
              </PrimaryButton>
            </div>
          </div>
        </div>
      </section>
  <div className="left-[200px] top-[1200px] absolute justify-start text-black text-3xl font-semibold font-['Be_Vietnam_Pro']">Cuộc thi đang diễn ra</div>
  <img className="w-[827px] h-[670px] left-[720px] top-[1200px] absolute rounded-[30px]" src="https://plus.unsplash.com/premium_vector-1697729767007-36c5a80b5782?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2910" />
  <div className="w-96 left-[200px] top-[1265px] absolute inline-flex flex-col justify-start items-start gap-6">
    <div className="self-stretch justify-start text-black text-5xl font-semibold font-['Be_Vietnam_Pro']">Thành Phố Trong <br/>Mắt Em</div>
    <div className="self-stretch justify-start text-black text-xl font-normal font-['Be_Vietnam_Pro']">Thành Phố Trong Mắt Em” là cuộc thi vẽ tranh dành cho học sinh lớp 1–9 tại TP.HCM, nơi các em thể hiện góc nhìn và ước mơ về thành phố bằng màu sắc sáng tạo.</div>
    <div className="inline-flex justify-center items-center gap-[5px]">
      <div className="flex justify-start items-center gap-3.5">
        <div className="flex justify-start items-center gap-1.5">
          <div className="w-28 justify-start text-black text-xl font-bold font-['Be_Vietnam_Pro']">Thời gian:</div>
        </div>
      </div>
      <div className="w-96 h-3.5 justify-center text-black text-xl font-normal font-['Be_Vietnam_Pro']">21-10-2025 đến 12-12-2025</div>
    </div>
    <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
      <div className="inline-flex justify-start items-center gap-3.5">
        <div className="flex justify-start items-center gap-1.5">
          <div className="w-16 justify-start text-black text-xl font-bold font-['Be_Vietnam_Pro']">Lưu ý:</div>
        </div>
      </div>
      <div className="self-stretch h-11 justify-center text-black text-xl font-normal font-['Be_Vietnam_Pro']">Thí sinh cần nộp bản cứng tác phẩm trước ngày 30-4-1974</div>
    </div>
  </div>
  <div className="left-[200px] top-[1782px] absolute">
    <PrimaryButton variant="large">
      Tham gia ngay
    </PrimaryButton>
  </div>
  <div className="w-[1440px] h-[1024px] left-0 top-[2048px] absolute bg-black" />
  <div className="w-48 left-[200px] top-[2098px] absolute justify-start text-stone-200 text-3xl font-medium font-['Be_Vietnam_Pro']">Tin tức nổi bật</div>
  <div className="w-96 h-64 left-[200px] top-[2167px] absolute">
    <div className="w-96 left-0 top-[171px] absolute justify-start text-white text-lg font-normal font-['Be_Vietnam_Pro']">Digital & Comtemporary Art</div>
    <div className="w-96 left-0 top-[204px] absolute justify-start text-white text-xl font-medium font-['Be_Vietnam_Pro']">How Art Fairs Are Adapting to the Digital Age</div>
    <img className="w-96 h-40 left-0 top-0 absolute rounded-[10px]" src="https://placehold.co/390x161" />
  </div>
  <div className="w-96 h-64 left-[200px] top-[2448px] absolute">
    <div className="w-96 left-0 top-[171px] absolute justify-start text-white text-lg font-normal font-['Be_Vietnam_Pro']">Digital & Comtemporary Art</div>
    <div className="w-96 left-0 top-[204px] absolute justify-start text-white text-xl font-medium font-['Be_Vietnam_Pro']">How Art Fairs Are Adapting to the Digital Age</div>
    <img className="w-96 h-40 left-0 top-0 absolute rounded-[10px]" src="https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2066" />
  </div>
  <div className="w-96 h-64 left-[200px] top-[2730px] absolute">
    <div className="w-96 left-0 top-[171px] absolute justify-start text-white text-lg font-normal font-['Be_Vietnam_Pro']">Digital & Comtemporary Art</div>
    <div className="w-96 left-0 top-[204px] absolute justify-start text-white text-xl font-medium font-['Be_Vietnam_Pro']">How Art Fairs Are Adapting to the Digital Age</div>
    <img className="w-96 h-40 left-0 top-0 absolute rounded-[10px]" src="https://images.unsplash.com/photo-1578926375605-eaf7559b1458?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1963" />
  </div>
  <div className="w-0 h-[836px] left-[614px] top-[2167px] absolute outline outline-2 outline-offset-[-1px] outline-neutral-700" />
  <div className="left-[638px] top-[2740px] absolute justify-start text-white text-xl font-normal font-['Be_Vietnam_Pro']">Artist Spotlight</div>
  <div className="w-[565px] left-[638px] top-[2782px] absolute justify-start text-white text-3xl font-semibold font-['Be_Vietnam_Pro']">Spotlight To Emerging Artist: Ones to watch in 2025</div>
  <div className="w-[601px] left-[638px] top-[2879px] absolute justify-start text-white text-xl font-light font-['Be_Vietnam_Pro']">“Thành Phố Trong Mắt Em” là cuộc thi vẽ tranh dành cho học sinh từ lớp 1 đến lớp 9 đang học tập tại Thành phố Hồ Chí Minh. Cuộc thi khuyến khích các em thể hiện góc nhìn riêng về thành phố qua màu sắc,  đường nét và trí ...</div>
  <img className="w-[601px] h-[545px] left-[638px] top-[2167px] absolute rounded-[10px]" src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2071" />
  <div className="left-[200px] top-[3218px] absolute justify-start text-black text-3xl font-medium font-['Be_Vietnam_Pro']">Chiến dịch đang diễn ra</div>
  <img className="w-80 h-96 left-[200px] top-[3309px] absolute rounded-[10px]" src="https://placehold.co/333x385" />
  <div className="left-[238px] top-[3723px] absolute justify-start text-black text-xl font-medium font-['Be_Vietnam_Pro']">Gieo Mầm Tài Năng Trẻ</div>
  <div className="left-[632px] top-[3723px] absolute justify-start text-black text-xl font-medium font-['Be_Vietnam_Pro']">Tiếp Sức Nét Cọ</div>
  <div className="left-[976px] top-[3723px] absolute justify-start text-black text-xl font-medium font-['Be_Vietnam_Pro']">Mơ Ước Màu Nước</div>
  <div className="w-80 left-[202px] top-[3769px] absolute text-center justify-start text-black text-lg font-light font-['Be_Vietnam_Pro']">Mục tiêu gây quỹ để mua vật liệu vẽ chất lượng và tổ chức các buổi workshop miễn phí cho thí sinh.</div>
  <div className="w-80 left-[555px] top-[3769px] absolute text-center justify-start text-black text-lg font-light font-['Be_Vietnam_Pro']">Kêu gọi cộng đồng hỗ trợ kinh phí in ấn, trưng bày tác phẩm tại triển lãm cuối cuộc thi.</div>
  <div className="w-80 left-[907px] top-[3769px] absolute text-center justify-start text-black text-lg font-light font-['Be_Vietnam_Pro']">Mục tiêu gây quỹ nhỏ nhằm cung cấp dụng cụ vẽ cho các thí sinh có hoàn cảnh khó khăn tham gia.</div>
  <div className="left-[216px] top-[3885px] absolute">
    <PrimaryButton variant="large">
      Đăng ký tài trợ
    </PrimaryButton>
  </div>
  <div className="left-[569px] top-[3885px] absolute">
    <PrimaryButton variant="large">
      Đăng ký tài trợ
    </PrimaryButton>
  </div>
  <div className="left-[921px] top-[3885px] absolute">
    <PrimaryButton variant="large">
      Đăng ký tài trợ
    </PrimaryButton>
  </div>
  <img className="w-80 h-96 left-[908px] top-[3309px] absolute rounded-[10px]" src="https://placehold.co/333x385" />
  <img className="w-80 h-96 left-[553px] top-[3309px] absolute rounded-[10px]" src="https://placehold.co/333x385" />
</div>
  );
}
