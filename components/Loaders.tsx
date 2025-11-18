import React, { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react'; // Import LottieRefCurrentProps
import animationData from '../public/load/artchain.json'; 

// ... (Interface LoaderProps giữ nguyên, nhưng loại bỏ prop 'speed' nếu bạn muốn nó luôn là 2x)

interface LoaderProps {
  width?: string;
  height?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
    width = "150px", 
    height = "150px", 
    text = "Đang tải...",
}) => {
  // 1. Sử dụng useRef để tham chiếu đến instance Lottie
  const lottieRef = useRef<LottieRefCurrentProps>(null); 
  
  // Tốc độ mong muốn (2x)
  const desiredSpeed = 2.0;

  // 2. Sử dụng useEffect để thiết lập tốc độ sau khi component mount
  useEffect(() => {
    // Kiểm tra xem Lottie instance đã sẵn sàng chưa
    if (lottieRef.current) {
      // Gọi API setSpeed của lottie-web qua ref
      lottieRef.current.setSpeed(desiredSpeed);
    }
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div style={{ width, height }}>
        <Lottie 
          lottieRef={lottieRef} // 3. Gán ref vào component Lottie
          animationData={animationData} 
          loop={true}                   
          autoplay={true}     
          // LOẠI BỎ THUỘC TÍNH 'speed' GÂY LỖI
          style={{ width: '100%', height: '100%' }}
          aria-label="Hoạt ảnh đang tải"
        />
      </div>
      
      <p style={{ marginTop: '10px', color: '#555' }}>{text}</p>
    </div>
  );
};

export default Loader;