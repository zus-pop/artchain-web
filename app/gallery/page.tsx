export default function GalleryPage() {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Thư viện Nghệ thuật
          </h1>
          <p className="text-xl text-gray-300">
            Khám phá những tác phẩm nghệ thuật xuất sắc
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Art gallery items */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 group-hover:from-blue-500/50 group-hover:to-purple-500/50 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold mb-1">Tác phẩm #{i + 1}</h3>
                  <p className="text-gray-300 text-sm">Nghệ sĩ ABC</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
            Xem thêm tác phẩm
          </button>
        </div>
      </div>
    </div>
  );
}