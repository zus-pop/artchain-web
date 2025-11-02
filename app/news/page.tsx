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
  Check,
  Paintbrush, // Icon mới cho Brand Identity
  Scan, // Icon mới cho Illustration
  Megaphone, // Icon mới cho Marketing
  Globe, // Icon mới cho Web Design
  Package, // Icon mới cho Packaging Design
  Blocks,
  Link,
  Apple,      // Icon cho logo Apple
  Atom,       // Icon cho logo Atom
  Smartphone, // Icon cho logo Blackberry (thay thế)
  Cloud,      // Icon cho logo Dropbox (thay thế)
  Droplet,    // Icon cho logo giọt nước
  ArrowLeft,  // Icon cho testimonial nav
  ArrowRight
} from "lucide-react"; // Thêm icon Check

/**
 * Component helper cho icon mạng xã hội
 */
const IconWrapper = ({
  href = "#",
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) => (
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
      <Icon className="w-12 h-12 text-green-500" />
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
          className="absolute top-4 right-4 text-white hover:text-green-500 transition-colors"
        >
          <Link className="w-6 h-6" />
        </a>
        <h3 className="text-white text-xl font-semibold mb-2 mt-8">{title}</h3>
        <p className="text-gray-300 text-sm">{category}</p>
      </div>
    </div>
  );
};

const FormInput = ({ type = 'text', name, placeholder }: { type?: string, name: string, placeholder: string }) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full bg-transparent border-b border-gray-500/50 py-4 text-white
                 focus:outline-none focus:border-green-500 transition-colors"
      required
    />
  </div>
);

/**
 * Component helper cho các mục thống kê
 */
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

const FooterIconWrapper = ({ href = "#", children }: { href?: string, children: React.ReactNode }) => (
  <a
    href={href}
    className="text-white/50 hover:text-white transition-colors duration-300"
    aria-label="Social media link"
  >
    {children}
  </a>
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
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScrollTop]);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            backgroundImage:
              "url('https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h-750&dpr=2')",
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
                We are a creative group of people who design influential brands
                and digital experiences.
              </h2>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  className="px-8 py-4 border-2 border-white text-sm font-bold tracking-widest uppercase 
                                   hover:bg-white hover:text-black transition-all duration-300"
                >
                  START A PROJECT
                </button>
                <button
                  className="px-8 py-4 border-2 border-white text-sm font-bold tracking-widest uppercase
                                   hover:bg-white hover:text-black transition-all duration-300"
                >
                  MORE ABOUT US
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* Sidebar Icon Mạng xã hội */}
        <aside className="absolute z-10 right-8 md:right-12 top-1/2 -translate-y-1/2 flex flex-col space-y-5">
          <IconWrapper>
            <Facebook className="w-4 h-4" />
          </IconWrapper>
          <IconWrapper>
            <Twitter className="w-4 h-4" />
          </IconWrapper>
          <IconWrapper>
            <Instagram className="w-4 h-4" />
          </IconWrapper>
          <IconWrapper>
            <PenTool className="w-4 h-4" />
          </IconWrapper>
          <IconWrapper>
            <Dribbble className="w-4 h-4" />
          </IconWrapper>
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
      <div
        className="absolute top-[calc(100vh_-_8rem)] right-[calc(2rem_+_2px)] w-0.5 bg-green-500 z-20"
        style={{ height: "128px" }}
      ></div>
      <div
        className="absolute right-[calc(2rem_+_2px)] w-0.5 bg-black z-20"
        style={{ height: "128px" }}
      ></div>

      {/* Section 2: About (We Are Glint) */}
      <section
        id="about-glint"
        className="py-20 md:py-32"
        style={{ backgroundColor: "#39b54a" }}
      >
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-black mb-6">
            HELLO THERE
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-10">
            We Are Glint
          </h2>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-16 md:mb-24 max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt.
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

      {/* Section 4: Recent Works (Mới) */}
      <section id="recent-works" className="relative pb-20 md:pb-32">
        {" "}
        {/* Thêm relative để chứa các lớp màu nền */}
        {/* Lớp màu nền đen 1/3 trên */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-black z-0"></div>
        {/* Lớp màu nền trắng 2/3 dưới */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-white z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-8">
          {" "}
          {/* z-10 để nội dung nằm trên lớp màu */}
          <div className="text-center max-w-3xl mx-auto pt-20 md:pt-32 mb-16 md:mb-24">
            {" "}
            {/* Thêm padding top để hiển thị nội dung trên nền đen */}
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-green-500 mb-6">
              RECENT WORKS
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              {" "}
              {/* Text màu trắng */}
              We love what we do, check out some of our latest works
            </h2>
          </div>
          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Cột trái: 1 dài, 2 ngắn (trên desktop) */}
            <div className="grid grid-cols-1 gap-0">
              <PortfolioItem
                src="https://preview.colorlib.com/theme/glint/images/portfolio/gallery/g-woodcraft.jpg"
                alt="Woodcraft"
                title="Woodcraft"
                category="Branding"
                isLarge={true} // Ảnh dài
              />
              <PortfolioItem
                src="https://preview.colorlib.com/theme/glint/images/portfolio/gallery/g-beetle.jpg"
                alt="The Beetle"
                title="The Beetle"
                category="Web Design"
              />
              <PortfolioItem
                src="https://preview.colorlib.com/theme/glint/images/portfolio/gallery/g-palmeira.jpg"
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
                src="https://images.unsplash.com/photo-1703593191680-03d4faa034b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1938"
                alt="Guitar"
                title="Guitar"
                category="Photography"
              />
              <PortfolioItem
                src="https://preview.colorlib.com/theme/glint/images/portfolio/gallery/g-grow-green.jpg"
                alt="Grow Green"
                title="Grow Green"
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
        className="relative py-20 md:py-32 bg-gray-100 text-black"
      > {/* ĐÃ THÊM: relative */}
        
        <div className="max-w-7xl mx-auto px-8">
          
          {/* Part 1: Clients */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-medium tracking-[0.3em] uppercase text-green-500 mb-6">
              OUR CLIENTS
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-16">
              Glint has been honored to partner up with these clients
            </h2>
          </div>
          
          {/* Client Logos Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-y-10 items-center justify-items-center max-w-5xl mx-auto text-gray-400">
            {/* Sử dụng các icon từ lucide-react để thay thế */}
            <Apple className="w-16 h-16 md:w-20 md:h-20" />
            <Atom className="w-16 h-16 md:w-20 md:h-20" />
            <Smartphone className="w-16 h-16 md:w-20 md:h-20" />
            <Cloud className="w-16 h-16 md:w-20 md:h-20" />
            <Droplet className="w-16 h-16 md:w-20 md:h-20" />
            <Globe className="w-16 h-16 md:w-20 md:h-20" />
          </div>

          {/* Part 2: Testimonials */}
          <div className="text-center pt-24 md:pt-32">
            
            {/* Gộp mũi tên và text vào chung 1 div */}
            <div className="flex justify-between items-center mb-10 max-w-5xl mx-auto">
              <button className="text-gray-400 hover:text-black transition-colors" aria-label="Previous testimonial">
                <ArrowLeft className="w-8 h-8" />
              </button>

              {/* Testimonial Content (Hardcoded) */}
              <p className="flex-1 px-8 text-2xl md:text-3xl font-serif italic text-gray-700 leading-relaxed text-center">
                Qui ipsam temporibus quisquam vel. Maiores eos cumque distinctio nam accusamus ipsum. Laudantium quia consequaturg 
                distinctio nam accusamus ipsum. Laudantium quia consequatur. Quo qui praesentium corp.
              </p>

              <button className="text-gray-400 hover:text-black transition-colors" aria-label="Next testimonial">
                <ArrowRight className="w-8 h-8" />
              </button>
            </div>

            {/* Author */}
            <img 
              src="https://preview.colorlib.com/theme/glint/images/avatars/user-01.jpg" 
              alt="Tim Cook" 
              className="w-16 h-16 rounded-full mx-auto mb-4"
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/64x64/e0e0e0/7f7f7f?text=TC')}
            />
            <h4 className="font-semibold text-lg">Tim Cook</h4>
            <p className="text-gray-500">CEO, Apple</p>

            {/* Pagination (static) */}
            <div className="flex justify-center space-x-2 mt-12">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>

        {/* ĐÃ THÊM: Thanh nối liền S5-S6 */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-green-500"
          style={{ 
            height: "128px", // 128px
            bottom: "-64px"  // Nằm 64px bên trên và 64px bên dưới
          }}
        ></div>
      </section>

      {/* Section 6: Contact Us (Mới) */}
      <section 
        id="contact" 
        className="relative pt-32 md:pt-48 pb-20 md:pb-32 text-white text-center" // ĐÃ SỬA: Tăng padding top
        style={{
          backgroundImage: "url('https://preview.colorlib.com/theme/glint/images/contact-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed' // Thêm hiệu ứng parallax
        }}
      >
        {/* Lớp phủ màu tối */}
        <div className="absolute inset-0 bg-black/70 z-0"></div>
        
        {/* Nội dung */}
        <div className="relative z-10 max-w-4xl mx-auto px-8">
          {/* ĐÃ XÓA: Thanh dọc cũ (w-0.5 h-16) đã được thay thế bằng thanh nối ở S5 */}
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-green-500 mb-6">
            CONTACT US
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-10">
            Reach out for a new project or just say hello
          </h2>
          <button className="px-10 py-5 bg-green-500 text-black text-sm font-bold tracking-widest uppercase
                             hover:bg-green-600 transition-all duration-300">
            SAY HELLO
          </button>
          <p className="text-lg text-gray-300 mt-8">
            <a href="mailto:info@glint.com" className="hover:text-white transition-colors">info@glint.com</a>
          </p>
        </div>

        {/* ĐÃ THÊM: Form và Contact Info */}
        <div className="relative z-10 max-w-6xl mx-auto px-8 pt-24 md:pt-32 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            
            {/* Cột 1 & 2: Form */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium tracking-[0.3em] uppercase text-white mb-8">
                Send Us A Message
              </h3>
              <form action="#" method="POST" className="space-y-6">
                <FormInput name="name" placeholder="Your Name" />
                <FormInput type="email" name="email" placeholder="Your Email" />
                <FormInput name="subject" placeholder="Subject" />
                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows={5}
                    className="w-full bg-transparent border-b border-gray-500/50 py-4 text-white
                               focus:outline-none focus:border-green-500 transition-colors"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="px-10 py-5 bg-green-500 text-black text-sm font-bold tracking-widest uppercase
                             hover:bg-green-600 transition-all duration-300"
                >
                  Submit
                </button>
              </form>
            </div>

            {/* Cột 3: Contact Info */}
            <div className="md:col-span-1 text-gray-300">
              <h3 className="text-sm font-medium tracking-[0.3em] uppercase text-white mb-8">
                Contact Info
              </h3>
              <div className="space-y-8">
                <div>
                  <h4 className="text-green-500 text-xs tracking-widest uppercase mb-2">Where to Find Us</h4>
                  <p className="text-white/70 leading-relaxed">1600 Amphitheatre Parkway<br />Mountain View, CA<br />94043 US</p>
                </div>
                <div>
                  <h4 className="text-green-500 text-xs tracking-widest uppercase mb-2">Email Us At</h4>
                  <p className="text-white/70 hover:text-white transition-colors"><a href="mailto:contact@glintsite.com">contact@glintsite.com</a></p>
                  <p className="text-white/70 hover:text-white transition-colors"><a href="mailto:info@glintsite.com">info@glintsite.com</a></p>
                </div>
                <div>
                  <h4 className="text-green-500 text-xs tracking-widest uppercase mb-2">Call Us At</h4>
                  <p className="text-white/70">Phone: (+63) 555 1212</p>
                  <p className="text-white/70">Mobile: (+63) 555 0100</p>
                  <p className="text-white/70">Fax: (+63) 555 0101</p>
                </div>
                <div className="flex space-x-5 pt-4">
                  <FooterIconWrapper><Facebook className="w-5 h-5" /></FooterIconWrapper>
                  <FooterIconWrapper><Twitter className="w-5 h-5" /></FooterIconWrapper>
                  <FooterIconWrapper><Instagram className="w-5 h-5" /></FooterIconWrapper>
                  <FooterIconWrapper><PenTool className="w-5 h-5" /></FooterIconWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nút "Scroll to Top" */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center
                    shadow-lg transition-opacity duration-300 z-50
                    ${
                      showScrollTop
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* Thêm một section footer giả để thấy nút scroll-to-top rõ hơn */}
      <footer className="h-40 bg-black"></footer>
    </div>
  );
}
