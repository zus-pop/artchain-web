export default function PrizesPage() {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Giải thưởng
          </h1>
          <p className="text-xl text-gray-300">
            Các phần thưởng hấp dẫn dành cho người chiến thắng
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Prize tiers */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-8 mb-6">
              <div className="text-6xl mb-4">🥇</div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">Giải Nhất</h3>
              <div className="text-4xl font-bold text-white mb-4">5,000,000 VNĐ</div>
              <ul className="text-gray-300 space-y-2">
                <li>• Cúp vàng danh giá</li>
                <li>• Chứng nhận nghệ sĩ xuất sắc</li>
                <li>• Cơ hội triển lãm cá nhân</li>
                <li>• Hợp đồng xuất bản</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-400/20 to-gray-600/20 border border-gray-400/30 rounded-2xl p-8 mb-6">
              <div className="text-6xl mb-4">🥈</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">Giải Nhì</h3>
              <div className="text-4xl font-bold text-white mb-4">2,000,000 VNĐ</div>
              <ul className="text-gray-300 space-y-2">
                <li>• Cúp bạc danh giá</li>
                <li>• Chứng nhận tài năng trẻ</li>
                <li>• Workshop với nghệ sĩ nổi tiếng</li>
                <li>• Tài trợ thiết bị nghệ thuật</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-8 mb-6">
              <div className="text-6xl mb-4">🥉</div>
              <h3 className="text-2xl font-bold text-orange-400 mb-2">Giải Ba</h3>
              <div className="text-4xl font-bold text-white mb-4">1,000,000 VNĐ</div>
              <ul className="text-gray-300 space-y-2">
                <li>• Cúp đồng danh giá</li>
                <li>• Chứng nhận khuyến khích</li>
                <li>• Khóa học nghệ thuật miễn phí</li>
                <li>• Bộ dụng cụ vẽ chuyên nghiệp</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Giải thưởng đặc biệt</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-blue-400 mb-2">Giải Sáng tạo</h3>
              <p className="text-gray-300">500,000 VNĐ + Tablet vẽ chuyên nghiệp</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-xl font-semibold text-purple-400 mb-2">Giải Nhân dân</h3>
              <p className="text-gray-300">300,000 VNĐ + Chứng nhận yêu thích</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}