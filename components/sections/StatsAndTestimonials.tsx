"use client";

import React from "react";

const StatsAndTestimonials = () => {
  const stats = [
    {
      number: "2,500+",
      label: "Nghệ Sĩ",
      icon: "👨‍🎨",
      description: "Nghệ sĩ đã tham gia"
    },
    {
      number: "150+",
      label: "Cuộc Thi",
      icon: "🏆",
      description: "Cuộc thi đã tổ chức"
    },
    {
      number: "5B+",
      label: "Giải Thưởng",
      icon: "💰", 
      description: "VND đã trao"
    },
    {
      number: "10,000+",
      label: "Tác Phẩm",
      icon: "🎨",
      description: "Tác phẩm nghệ thuật"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Minh Anh",
      role: "Họa sĩ chuyên nghiệp",
      content: "ArtChain đã giúp tôi kết nối với cộng đồng nghệ thuật rộng lớn và có cơ hội thể hiện tài năng. Những cuộc thi ở đây thực sự chất lượng và công bằng.",
      avatar: "🎨",
      rating: 5
    },
    {
      id: 2,
      name: "Trần Văn Bình", 
      role: "Sinh viên Mỹ thuật",
      content: "Nền tảng này không chỉ là nơi thi đua mà còn là nơi học hỏi. Tôi đã cải thiện kỹ năng rất nhiều qua việc xem các tác phẩm của những nghệ sĩ khác.",
      avatar: "🖌️",
      rating: 5
    },
    {
      id: 3,
      name: "Lê Thị Hoa",
      role: "Nghệ sĩ độc lập",
      content: "Giải thưởng từ ArtChain không chỉ về tiền mặt mà còn mang lại cơ hội triển lãm tác phẩm. Điều này thực sự có ý nghĩa với sự nghiệp của tôi.",
      avatar: "🌸",
      rating: 5
    }
  ];

  return (
    <div className="w-full py-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Stats Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cộng Đồng <span className="text-blue-400">Nghệ Thuật</span> Lớn Mạnh
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn nghệ sĩ tài năng trong hành trình sáng tạo nghệ thuật
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl p-6 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-blue-400 font-semibold mb-1">{stat.label}</div>
                  <div className="text-gray-400 text-sm">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nghệ Sĩ <span className="text-blue-400">Nói Gì</span> Về Chúng Tôi
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            Lời chia sẻ từ những nghệ sĩ đã thành công trên nền tảng ArtChain
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-300"
            >
              {/* Rating Stars */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-300 text-center mb-6 italic leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="text-center">
                <div className="text-2xl mb-2">{testimonial.avatar}</div>
                <h4 className="text-white font-semibold">{testimonial.name}</h4>
                <p className="text-blue-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Sẵn Sàng Trở Thành Nghệ Sĩ Tiếp Theo?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Tham gia cộng đồng nghệ thuật ArtChain và bắt đầu hành trình sáng tạo của bạn ngay hôm nay
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/register"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Đăng Ký Miễn Phí
            </a>
            <a 
              href="/competitions"
              className="border-2 border-white/20 text-white font-semibold py-3 px-8 rounded-xl hover:border-white/40 transition-all duration-200"
            >
              Xem Cuộc Thi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsAndTestimonials;