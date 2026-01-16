import React from 'react';
import { Search, User, ShoppingBag, ChevronRight, Clock, Heart, ArrowRight } from 'lucide-react';

// Mock data cho các bức tranh
const AUCTION_ITEMS = [
  {
    id: 1,
    title: "Sự Hoài Niệm Vĩnh Hằng",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=500",
    currentBid: "9,318.00",
    lotNum: "235364",
    endTime: { days: 302, hours: 7, mins: 7, secs: 16 }
  },
  {
    id: 2,
    title: "Bình Minh Trên Biển Đỏ",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=500",
    currentBid: "5,700.00",
    lotNum: "115364",
    endTime: { days: 302, hours: 7, mins: 7, secs: 16 }
  },
  {
    id: 3,
    title: "Vũ Điệu Của Ánh Sáng",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=500",
    currentBid: "3,048.00",
    lotNum: "137684",
    endTime: { days: 292, hours: 7, mins: 7, secs: 16 }
  },
  {
    id: 4,
    title: "Chân Dung Thời Đại",
    image: "https://images.unsplash.com/photo-1576132704435-6cd99109b1e1?q=80&w=500",
    currentBid: "10,060.00",
    lotNum: "576894",
    endTime: { days: 282, hours: 7, mins: 7, secs: 16 }
  }
];

const CATEGORIES = [
  { name: "Tranh Sơn Dầu", count: 12, icon: "🎨" },
  { name: "Kỹ Thuật Số", count: 8, icon: "💻" },
  { name: "Điêu Khắc", count: 5, icon: "🗿" },
  { name: "Tranh Thủy Mặc", count: 15, icon: "🖌️" },
  { name: "Nhiếp Ảnh", count: 20, icon: "📷" },
  { name: "Trừu Tượng", count: 10, icon: "🧬" },
];

export default function AuctionPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Top Header */}
      <div className="bg-slate-50 border-b py-2 px-4 text-xs text-slate-500 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span>Email: info@artauction.com</span>
            <span>Hỗ trợ khách hàng</span>
          </div>
          <div className="flex gap-4">
            <span>Cách đấu giá</span>
            <span>Bán tác phẩm</span>
            <span>Ngôn ngữ: VN</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <h1 className="text-2xl font-bold tracking-tighter text-emerald-600">PROBID<span className="text-slate-800">ART</span></h1>
            <nav className="hidden lg:flex gap-6 font-medium text-sm uppercase tracking-wide">
              <a href="#" className="text-emerald-600">Trang chủ</a>
              <a href="#" className="hover:text-emerald-600 transition">Cuộc đấu giá</a>
              <a href="#" className="hover:text-emerald-600 transition">Nghệ sĩ</a>
              <a href="#" className="hover:text-emerald-600 transition">Tin tức</a>
              <a href="#" className="hover:text-emerald-600 transition">Liên hệ</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="Tìm tác phẩm..." 
                className="pl-4 pr-10 py-2 border rounded-full text-sm w-64 focus:outline-emerald-500"
              />
              <Search className="absolute right-3 top-2.5 text-slate-400 w-4 h-4" />
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-full"><User className="w-5 h-5" /></button>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" /> Tài khoản
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1492691523567-627397565886?q=80&w=1500" 
            className="w-full h-full object-cover" 
            alt="Hero Background"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 w-full text-white">
          <p className="text-emerald-400 font-bold mb-4 tracking-widest uppercase">Thương hiệu bạn có thể tin tưởng</p>
          <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight max-w-2xl">
            Lựa chọn tác phẩm <br /> <span className="italic font-normal text-emerald-300">đẳng cấp nhất.</span>
          </h2>
          <div className="flex gap-8 mb-12 text-sm text-slate-300">
            <div className="flex items-center gap-2">✓ Đấu giá minh bạch</div>
            <div className="flex items-center gap-2">✓ Bảo chứng tác phẩm</div>
            <div className="flex items-center gap-2">✓ Hỗ trợ 24/7</div>
          </div>
          <div className="flex gap-4">
            <button className="bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-md font-bold transition flex items-center gap-2">
              Đấu giá ngay <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 px-8 py-4 rounded-md font-bold transition">
              Xem bộ sưu tập
            </button>
          </div>
        </div>
      </section>

      {/* Live Auction Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-3xl font-serif font-bold mb-2">Đấu giá trực tiếp</h3>
            <p className="text-slate-500">Các phiên đấu giá nghệ thuật đang diễn ra sôi nổi nhất.</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 border rounded-full hover:bg-slate-50 transition">←</button>
            <button className="p-2 border rounded-full hover:bg-slate-50 transition">→</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AUCTION_ITEMS.map((item) => (
            <div key={item.id} className="group border rounded-xl overflow-hidden hover:shadow-2xl transition duration-300">
              <div className="relative h-64 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Trực tiếp
                </div>
                {/* Countdown timer overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 w-[90%] justify-center">
                  {[item.endTime.days, item.endTime.hours, item.endTime.mins, item.endTime.secs].map((unit, i) => (
                    <div key={i} className="bg-white px-2 py-1 rounded shadow-lg text-center min-w-[45px]">
                      <div className="text-sm font-bold leading-none">{unit}</div>
                      <div className="text-[8px] uppercase text-slate-400">
                        {['Ngày', 'Giờ', 'Phút', 'Giây'][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 bg-white">
                <h4 className="font-bold text-lg mb-2 truncate">{item.title}</h4>
                <div className="flex justify-between items-center text-sm mb-4">
                  <div>
                    <span className="text-slate-400">Giá hiện tại</span>
                    <p className="font-bold text-emerald-600 text-lg">${item.currentBid}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">Lô số</span>
                    <p className="font-bold">#{item.lotNum}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-slate-900 text-white py-2 rounded-md font-bold text-sm hover:bg-emerald-600 transition">
                    Đấu giá ngay
                  </button>
                  <button className="p-2 border rounded-md hover:bg-slate-50">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
            <button className="text-slate-900 font-bold underline underline-offset-8 decoration-emerald-500 hover:text-emerald-600 transition">Xem tất cả phiên đấu giá</button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-serif font-bold mb-12">Danh mục nghệ thuật</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl hover:shadow-xl transition cursor-pointer group">
                <div className="text-4xl mb-4 group-hover:scale-125 transition duration-300">{cat.icon}</div>
                <h5 className="font-bold text-sm mb-1">{cat.name}</h5>
                <p className="text-xs text-slate-400">{cat.count} tác phẩm</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer (Simplified) */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-white text-2xl font-bold mb-6 italic">PROBID</h4>
            <p className="text-sm leading-relaxed mb-6">
              Nền tảng đấu giá tranh nghệ thuật hàng đầu thế giới, kết nối nghệ sĩ và các nhà sưu tầm đam mê cái đẹp.
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6">Liên kết nhanh</h5>
            <ul className="space-y-3 text-sm">
              <li>Trang chủ</li>
              <li>Về chúng tôi</li>
              <li>Tin tức nghệ thuật</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6">Tài khoản</h5>
            <ul className="space-y-3 text-sm">
              <li>Thông tin cá nhân</li>
              <li>Tác phẩm đang đấu</li>
              <li>Lịch sử thanh toán</li>
              <li>Danh sách yêu thích</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6">Bản tin</h5>
            <p className="text-sm mb-4">Đăng ký để nhận thông tin về các buổi đấu giá sắp tới.</p>
            <div className="flex">
              <input type="email" placeholder="Email của bạn" className="bg-slate-800 border-none rounded-l-md px-4 py-2 w-full text-sm focus:ring-1 focus:ring-emerald-500" />
              <button className="bg-emerald-500 text-white px-4 py-2 rounded-r-md">Gửi</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}