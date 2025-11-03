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

  return (
    <div className="relative w-full font-sans bg-black">
      {/* Section 1: Hero */}
      <section className="relative h-screen w-full text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1578301978018-3005759f48f7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2044')",
          }}
        />
        <div className="absolute inset-0 bg-black/70 bg-blend-multiply"></div>
        
        {/* Fixed Header với hiệu ứng kính mờ */}
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-6 bg-black/30 backdrop-blur-md border-b border-white/10 transition-all duration-300">
          <div className="flex items-center space-x-3">
            <img 
              src="/images/newlogo.png" 
              alt="Artchain Logo" 
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
            />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight cursor-pointer">
              Artchain.
            </h1>
          </div>
          <button onClick={() => setIsMenuOpen(true)} className="flex items-center space-x-2 sm:space-x-3 group">
            <span className="text-xs sm:text-sm font-medium tracking-widest uppercase group-hover:text-gray-300 transition-colors">
              Menu
            </span>
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 group-hover:text-gray-300 transition-colors" />
          </button>
        </header>
        
        <div className="relative z-10 flex flex-col h-full">

          <main className="flex-grow flex items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 pt-20 md:pt-24">
            <div className="max-w-2xl">
              <p className="text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-gray-300 mb-4 sm:mb-6">
                WELCOME TO ARTCHAIN
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 sm:mb-8 md:mb-10 text-shadow-lg">
                CUỘC THI NÉT VẼ XANH 2025
              </h2>
              <p className="text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-orange-700 mb-4 sm:mb-6">
                Gửi gắm những câu chuyện, ý tưởng và khát vọng qua màu sắc độc
                đáo của riêng mình.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-xs sm:text-sm font-bold tracking-widest uppercase 
                                   hover:bg-white hover:text-black transition-all duration-300"
                >
                  THAM GIA NGAY
                </button>
                <button
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-xs sm:text-sm font-bold tracking-widest uppercase
                                   hover:bg-white hover:text-black transition-all duration-300"
                >
                  VỀ CHÚNG TÔI
                </button>
              </div>
            </div>
          </main>
        </div>
        <aside className="absolute z-10 right-8 md:right-12 top-1/2 -translate-y-1/2">
          <button
            onClick={() => setShowSocialIcons(!showSocialIcons)}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-all duration-300
              ${showSocialIcons ? 'bg-transparent border-0' : 'border border-white/30 hover:border-white'}`}
            aria-label="Toggle social media links"
          >
            {showSocialIcons ? (
              <X className="w-4 h-4" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>

          <div
            className={`flex flex-col space-y-5 mt-5 transition-all duration-300 origin-top ${showSocialIcons ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}
          >
            <IconWrapper href="https://facebook.com" label="Facebook">
              <Facebook className="w-4 h-4" />
            </IconWrapper>
            <IconWrapper href="https://twitter.com" label="Twitter">
              <Twitter className="w-4 h-4" />
            </IconWrapper>
            <IconWrapper href="https://instagram.com" label="Instagram">
              <Instagram className="w-4 h-4" />
            </IconWrapper>
            <IconWrapper label="Behance">
              <PenTool className="w-4 h-4" />
            </IconWrapper>
            <IconWrapper href="https://dribbble.com" label="Dribbble">
              <Dribbble className="w-4 h-4" />
            </IconWrapper>
          </div>
        </aside>

        <a
          href="#about-us"
          className="absolute z-10 bottom-6 sm:bottom-8 right-6 sm:right-8 md:right-12 flex items-baseline space-x-3 sm:space-x-6 cursor-pointer group"
          aria-label="Scroll to next section"
        >
          <div className="flex items-center space-x-2">
            <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 text-orange-700" />
            <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white/70 group-hover:text-white transition-colors hidden sm:inline">
              SCROLL DOWN
            </span>
          </div>
        </a>
      </section>
      <div
        className="absolute top-[calc(100vh_-_6rem)] right-[calc(1.5rem_+_2px)] sm:right-[calc(2rem_+_2px)] w-0.5 bg-orange-700 z-20"
        style={{ height: "96px" }}
      ></div>
      <div
        className="absolute right-[calc(1.5rem_+_2px)] sm:right-[calc(2rem_+_2px)] w-0.5 bg-white z-20"
        style={{ height: "96px" }}
      ></div>

      {/* Section 2: About (We Are Artchain) */}
      <section
        id="stats"
        className="py-16 sm:py-20 md:py-28 lg:py-32"
        style={{ backgroundColor: '#c2410c' }} 
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <p className="text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-black mb-4 sm:mb-6">
            THÀNH TỰU CỦA CHÚNG TÔI
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 md:mb-10">
            Nơi Tài Năng Tỏa Sáng
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-12 sm:mb-16 md:mb-20 lg:mb-24 max-w-3xl mx-auto">
            Từ những nét vẽ đầu tiên đến các tác phẩm đoạt giải, "Nét Vẽ Xanh" đã trở thành sân chơi uy tín, ươm mầm hàng ngàn tài năng trẻ trên khắp cả nước, truyền cảm hứng sáng tạo và tình yêu hội họa.
          </p>

          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row justify-center items-center gap-8 sm:gap-6 md:gap-8">
            
            <StatItem number="1270+" label="Tác phẩm dự thi" />
            
            <div className="w-full sm:hidden lg:block lg:w-px h-px lg:h-24 bg-white/30"></div>

            <StatItem number="150+" label="Trường học tham gia" />
            
            <div className="w-full sm:hidden lg:block lg:w-px h-px lg:h-24 bg-white/30"></div>

            <StatItem number="109" label="Giải thưởng đã trao" />
            
            <div className="w-full sm:hidden lg:block lg:w-px h-px lg:h-24 bg-white/30"></div>
            
            <StatItem number="50+" label="Tỉnh thành tham dự" />
          </div>
        </div>
      </section>

      {/* Section 3: Cuộc thi đang diễn ra (MỚI) */}
      <section
        id="ongoing-contests"
        className="py-16 sm:py-20 md:py-28 lg:py-32 bg-gray-100 text-black overflow-x-hidden"
      >
        {" "}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">
              Cuộc thi đang diễn ra
            </h2>
            <div className="w-24 sm:w-32 h-1 bg-black mx-auto mt-3 sm:mt-4 mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg text-gray-700">
              Chọn một cuộc thi và thể hiện tài năng của bạn ngay hôm nay!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:gap-24">
            <CompetitionCard
              imgSrc="https://images.unsplash.com/photo-1745245423265-e2c9f0285dfd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2101"
              title="Thành Phố Trong Mắt Em"
              description="“Thành Phố Trong Mắt Em” là cuộc thi vẽ tranh dành cho học sinh lớp 1-9 tại TP.HCM, nơi các em thể hiện góc nhìn và ước mơ về thành phố bằng màu sắc sống động."
              date="21-10-2025 đến 12-12-2025"
              note="Thí sinh cần nộp bản cứng tác phẩm trước ngày 30-11-2025"
              reverse={false} // Text-left, Image-right
            />
            <CompetitionCard
              imgSrc="https://images.unsplash.com/photo-1578926375605-eaf7559b1458?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1963"
              title="Thế Giới Cổ Tích"
              description="Một cuộc thi vẽ toàn quốc dành cho học sinh cấp 1, nơi các em tái hiện lại những nhân vật và câu chuyện cổ tích mà mình yêu thích nhất qua nét vẽ."
              date="15-11-2025 đến 30-01-2026"
              note="Tác phẩm dự thi có thể vẽ tay hoặc vẽ trên máy tính (digital art)."
              reverse={true} // Image-left, Text-right (để xen kẽ)
            />
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <button
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-black text-black text-xs sm:text-sm font-bold tracking-widest uppercase 
                               hover:bg-black hover:text-white transition-all duration-300"
            >
              XEM TẤT CẢ CUỘC THI
            </button>
          </div>
        </div>
      </section>

      {/* Section 4: Recent Works (Mới) */}
      <section id="recent-works" className="relative pb-16 sm:pb-20 md:pb-28 lg:pb-32">
        {" "}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-black z-0"></div>
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-white z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {" "}
          <div className="text-center max-w-3xl mx-auto pt-16 sm:pt-20 md:pt-28 lg:pt-32 mb-12 sm:mb-16 md:mb-20 lg:mb-24">
            {" "}
            <p className="text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-orange-700 mb-4 sm:mb-6">
              Tác phẩm nổi bật
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              {" "}
              TRIỂN LÃM
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="grid grid-cols-1 gap-0">
              <PortfolioItem
                src="https://images.unsplash.com/photo-1548811579-017cf2a4268b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=989"
                alt="Woodcraft"
                title="Woodcraft"
                category="Branding"
                isLarge={true} // Ảnh dài
              />
              <PortfolioItem
                src="https://images.unsplash.com/photo-1459908676235-d5f02a50184b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070"
                alt="The Beetle"
                title="The Beetle"
                category="Web Design"
              />
              <PortfolioItem
                src="https://images.unsplash.com/photo-1703593191680-03d4faa034b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1938"
                alt="Palmeira"
                title="Palmeira"
                category="Web Development"
                isLarge={false} // Đã sửa: Trả về false để 2 cột bằng nhau
              />
            </div>

            {/* Cột phải: 2 ngắn, 1 dài (trên desktop) */}
            <div className="grid grid-cols-1 gap-0">
              <PortfolioItem
                src="https://images.unsplash.com/photo-1578301978018-3005759f48f7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2044"
                alt="Lamp"
                title="Lamp"
                category="Photography"
              />
              <PortfolioItem
                src="https://images.unsplash.com/photo-1569091791842-7cfb64e04797?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1035"
                alt="Guitar"
                title="Guitar"
                category="Photography"
              />
              <PortfolioItem
                src="https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=984"
                alt="Grow orange"
                title="Grow orange"
                category="Branding"
                isLarge={true} // Ảnh dài
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Clients & Testimonials (Mới) */}
      <section
        id="clients-testimonials"
        className="relative py-16 sm:py-20 md:py-28 lg:py-32 bg-gray-100 text-black"
      >
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-orange-700 mb-4 sm:mb-6">
              Đồng hành cùng tài năng trẻ
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-12 sm:mb-16">
              NHÀ TÀI TRỢ & ĐỐI TÁC
            </h2>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-y-8 sm:gap-y-10 items-center justify-items-center max-w-5xl mx-auto text-gray-400">
            <Apple className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <Atom className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <Smartphone className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <Cloud className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <Droplet className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20" />
            <Globe className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20" />
          </div>

          <div className="text-center pt-16 sm:pt-20 md:pt-28 lg:pt-32">
            <div className="flex justify-between items-center mb-8 sm:mb-10 max-w-5xl mx-auto">
              <button
                className="text-gray-400 hover:text-black transition-colors flex-shrink-0"
                aria-label="Previous testimonial"
              >
                <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </button>

              <p className="flex-1 px-4 sm:px-6 md:px-8 text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif italic text-gray-700 leading-relaxed text-center">
                Qui ipsam temporibus quisquam vel. Maiores eos cumque distinctio
                nam accusamus ipsum. Laudantium quia consequaturg distinctio nam
                accusamus ipsum. Laudantium quia consequatur. Quo qui
                praesentium corp.
              </p>

              <button
                className="text-gray-400 hover:text-black transition-colors flex-shrink-0"
                aria-label="Next testimonial"
              >
                <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </button>
            </div>

            <img
              src="https://preview.colorlib.com/theme/glint/images/avatars/user-01.jpg"
              alt="Tim Cook"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full mx-auto mb-3 sm:mb-4"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://placehold.co/64x64/e0e0e0/7f7f7f?text=TC")
              }
            />
            <h4 className="font-semibold text-base sm:text-lg">Tim Cook</h4>
            <p className="text-sm sm:text-base text-gray-500">CEO, Apple</p>

            <div className="flex justify-center space-x-2 mt-8 sm:mt-10 md:mt-12">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-orange-700"></div>
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>
        <div
          className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-black"
          style={{
            height: "48px",
            bottom: "0",
          }}
        ></div>
        <div
          className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-white!"
          style={{
            height: "48px",
            bottom: "-48px",
          }}
        ></div>
      </section>

      {/* Section 6: Contact Us (Mới) */}
      <section
        id="contact"
        className="relative pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-16 sm:pb-20 md:pb-28 lg:pb-32 text-white text-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1423784346385-c1d4dac9893a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <p className="text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-orange-700 mb-4 sm:mb-6">
            LIÊN HỆ VỚI CHÚNG TÔI
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 md:mb-10">
            Gửi tác phẩm hoặc câu hỏi
          </h2>
          <button
            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-orange-700 text-black text-xs sm:text-sm font-bold tracking-widest uppercase
                             hover:bg-orange-800 transition-all duration-300"
          >
            CONTACT US
          </button>
          <p className="text-base sm:text-lg text-gray-300 mt-6 sm:mt-8">
            <a
              href="mailto:info@glint.com"
              className="hover:text-white transition-colors"
            >
              info@glint.com
            </a>
          </p>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-16 sm:pt-20 md:pt-28 lg:pt-32 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-14 md:gap-16">
            {/* Cột 1 & 2: Form */}
            <div className="md:col-span-2">
              <h3 className="text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white mb-6 sm:mb-8">
                Send Us A Message
              </h3>
              <form action="#" method="POST" className="space-y-4 sm:space-y-6">
                <FormInput name="name" placeholder="Your Name" />
                <FormInput type="email" name="email" placeholder="Your Email" />
                <FormInput name="subject" placeholder="Subject" />
                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows={5}
                    className="w-full bg-transparent border-b border-gray-500/50 py-4 text-white
                               focus:outline-none focus:border-orange-700 transition-colors"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-orange-700 text-black text-xs sm:text-sm font-bold tracking-widest uppercase
                             hover:bg-orange-800 transition-all duration-300"
                >
                  Submit
                </button>
              </form>
            </div>

            {/* Cột 3: Contact Info */}
            <div className="md:col-span-1 text-gray-300">
              <h3 className="text-xs sm:text-sm font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white mb-6 sm:mb-8">
                Contact Info
              </h3>
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h4 className="text-orange-700 text-xs tracking-widest uppercase mb-2">
                    Where to Find Us
                  </h4>
                  <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                    1600 Amphitheatre Parkway
                    <br />
                    Mountain View, CA
                    <br />
                    94043 US
                  </p>
                </div>
                <div>
                  <h4 className="text-orange-700 text-xs tracking-widest uppercase mb-2">
                    Email Us At
                  </h4>
                  <p className="text-white/70 hover:text-white transition-colors text-sm sm:text-base">
                    <a href="mailto:contact@glintsite.com">
                      contact@glintsite.com
                    </a>
                  </p>
                  <p className="text-white/70 hover:text-white transition-colors text-sm sm:text-base">
                    <a href="mailto:info@glintsite.com">info@glintsite.com</a>
                  </p>
                </div>
                <div>
                  <h4 className="text-orange-700 text-xs tracking-widest uppercase mb-2">
                    Call Us At
                  </h4>
                  <p className="text-white/70 text-sm sm:text-base">Phone: (+63) 555 1212</p>
                  <p className="text-white/70 text-sm sm:text-base">Mobile: (+63) 555 0100</p>
                  <p className="text-white/70 text-sm sm:text-base">Fax: (+63) 555 0101</p>
                </div>
                <div className="flex space-x-4 sm:space-x-5 pt-4">
                  <FooterIconWrapper>
                    <Facebook className="w-5 h-5" />
                  </FooterIconWrapper>
                  <FooterIconWrapper>
                    <Twitter className="w-5 h-5" />
                  </FooterIconWrapper>
                  <FooterIconWrapper>
                    <Instagram className="w-5 h-5" />
                  </FooterIconWrapper>
                  <FooterIconWrapper>
                    <PenTool className="w-5 h-5" />
                  </FooterIconWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Footer (MỚI) */}
      <footer className="bg-black text-gray-400 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Top part: Logo + Subscribe */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-14 md:mb-16">
            {/* Cột 1: Logo & Text */}
            <div className="md:col-span-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Artchain.</h2>
              <p className="text-xs sm:text-sm leading-relaxed">
                "Nét Vẽ Xanh" là một sáng kiến của ARTCHAIN, nhằm tạo ra một sân chơi sáng tạo, lành mạnh, khuyến khích các em học sinh thể hiện tài năng hội họa và góc nhìn độc đáo về thế giới xung quanh.
              </p>
            </div>

            {/* Cột rỗng (để tạo khoảng cách) */}
            <div className="hidden md:block"></div>

            {/* Cột 2: Subscribe */}
            <div>
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Get Notified</h3>
              <p className="text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                Quia quo qui sed odit. Quaerat voluptas autem necessitatibus
                vitae aut non alias sed quia. Ut itaque enim optio ut excepturi
                deserunt iusto porro.
              </p>
              <form className="flex flex-col sm:flex-row w-full gap-2 sm:gap-0">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 pl-9 sm:pl-10 pr-4 py-3 text-sm sm:text-base focus:outline-none focus:border-orange-700 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-orange-700 text-black text-xs sm:text-sm font-bold tracking-widest uppercase
                                   hover:bg-orange-800 transition-all duration-300"
                >
                  SUBSCRIBE
                </button>
              </form>
            </div>
          </div>

          {/* Bottom part: Copyright */}
          <div className="border-t border-white/10 pt-6 sm:pt-8 text-center md:text-left">
            <p className="text-xs sm:text-sm">
              © Copyright Artchain 2025
            </p>
          </div>
        </div>
      </footer>

      {/* Nút "Scroll to Top" */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center
                    shadow-lg transition-opacity duration-300 z-40
                    ${
                      showScrollTop
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Thêm một section footer giả để thấy nút scroll-to-top rõ hơn */}
      <footer className="h-32 sm:h-40 bg-black"></footer>

      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out
                    ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Lớp phủ mờ (Overlay) */}
        <div 
          className="absolute inset-0 bg-black/80"
          onClick={() => setIsMenuOpen(false)}
        ></div>

        {/* Nội dung Sheet */}
        <div 
          className={`fixed top-0 right-0 h-full w-full sm:w-96 max-w-full bg-black text-white shadow-xl 
                      transition-transform duration-300 ease-in-out
                      ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* Header của Sheet */}
          <div className="flex justify-between items-center p-6 sm:p-8 border-b border-gray-700">
            <h2 className="text-base sm:text-lg font-medium tracking-widest uppercase">Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Các link điều hướng */}
          <nav className="flex flex-col p-6 sm:p-8 space-y-3 sm:space-y-4">
            <a 
              href="#contests" 
              onClick={(e) => { e.preventDefault(); handleMenuLinkClick('#contests'); }}
              className="text-xl sm:text-2xl font-bold text-gray-300 hover:text-orange-700 transition-colors py-2"
            >
              Cuộc Thi
            </a>
            <a 
              href="#works" 
              onClick={(e) => { e.preventDefault(); handleMenuLinkClick('#works'); }}
              className="text-xl sm:text-2xl font-bold text-gray-300 hover:text-orange-700 transition-colors py-2"
            >
              Tác Phẩm
            </a>
            <a 
              href="#stats" 
              onClick={(e) => { e.preventDefault(); handleMenuLinkClick('#stats'); }}
              className="text-xl sm:text-2xl font-bold text-gray-300 hover:text-orange-700 transition-colors py-2"
            >
              Thống Kê
            </a>
            <a 
              href="#sponsors" 
              onClick={(e) => { e.preventDefault(); handleMenuLinkClick('#sponsors'); }}
              className="text-xl sm:text-2xl font-bold text-gray-300 hover:text-orange-700 transition-colors py-2"
            >
              Nhà Tài Trợ
            </a>
            <a 
              href="#contact" 
              onClick={(e) => { e.preventDefault(); handleMenuLinkClick('#contact'); }}
              className="text-xl sm:text-2xl font-bold text-gray-300 hover:text-orange-700 transition-colors py-2"
            >
              Liên Hệ
            </a>
          </nav>

          {/* Footer của Sheet */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 border-t border-gray-700">
            <div className="flex justify-center space-x-5 sm:space-x-6">
              <IconWrapper><Facebook className="w-4 h-4" /></IconWrapper>
              <IconWrapper><Twitter className="w-4 h-4" /></IconWrapper>
              <IconWrapper><Instagram className="w-4 h-4" /></IconWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
