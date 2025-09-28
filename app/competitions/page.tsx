export default function CompetitionsPage() {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Cuộc thi đang diễn ra
          </h1>
          <p className="text-xl text-gray-300">
            Tham gia các cuộc thi nghệ thuật hấp dẫn
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Competition cards will be added here */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="h-48 bg-gradient-to-br from-blue-500/50 to-purple-500/50 rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Cuộc thi Nghệ thuật Số</h3>
            <p className="text-gray-300 mb-4">Thể hiện tài năng của bạn qua nghệ thuật số</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Còn 15 ngày</span>
              <span className="text-lg font-bold text-blue-400">1,000,000 VNĐ</span>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="h-48 bg-gradient-to-br from-green-500/50 to-blue-500/50 rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Tranh Truyền thống</h3>
            <p className="text-gray-300 mb-4">Sáng tạo với các kỹ thuật truyền thống</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Còn 30 ngày</span>
              <span className="text-lg font-bold text-green-400">2,000,000 VNĐ</span>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="h-48 bg-gradient-to-br from-purple-500/50 to-pink-500/50 rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Nghệ thuật Đương đại</h3>
            <p className="text-gray-300 mb-4">Khám phá những xu hướng nghệ thuật mới</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Còn 7 ngày</span>
              <span className="text-lg font-bold text-purple-400">500,000 VNĐ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}