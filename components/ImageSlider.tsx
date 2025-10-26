// File: ImageSlider.tsx
"use client"; // Đảm bảo component chạy phía Client để sử dụng Hooks

import React, { useState } from 'react';
import './ImageSlider.css';

// ------------------------------------
// 1. Định nghĩa Type (Interface)
// ------------------------------------
interface ImageItem {
  id: number;
  // Unsplash URL, tôi sẽ điều chỉnh kích thước để phù hợp
  full: string; 
  thumb: string;
  title: string;
}

// ------------------------------------
// 2. Dữ liệu Mẫu (sử dụng ảnh Unsplash)
// ------------------------------------
const images: ImageItem[] = [
  { 
    id: 1, 
    // Ảnh lớn: sa mạc (Marrakech Merzouga)
    full: 'https://images.unsplash.com/photo-1602294898768-b739023bac3d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2574', 
    thumb: 'https://images.unsplash.com/photo-1602294898768-b739023bac3d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2574', 
    // thumb: 'https://images.unsplash.com/photo-1549419137-97d8b548b809?w=250&h=300&fit=crop', 
    title: 'Sahara Desert' 
  },
  { 
    id: 2, 
    // Ảnh lớn: núi tuyết/khu nghỉ dưỡng (Nagano Prefecture)
    full: 'https://images.unsplash.com/photo-1571080708032-b973eb2ea285?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2671', 
    thumb: 'https://images.unsplash.com/photo-1571080708032-b973eb2ea285?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2671', 
    // thumb: 'https://images.unsplash.com/photo-1510461872166-50d75062a46e?w=250&h=300&fit=crop', 
    title: 'Japan Alps' 
  },
  { 
    id: 3, 
    // Ảnh lớn: vách đá/công viên quốc gia (Yosemite)
    full: 'https://images.unsplash.com/photo-1675720787471-9aaf944c0cc3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2667', 
    thumb: 'https://images.unsplash.com/photo-1675720787471-9aaf944c0cc3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2667', 
    //thumb: 'https://images.unsplash.com/photo-1548485293-847253503d2e?w=250&h=300&fit=crop', 
    title: 'Yosemite Park' 
  },
  { 
    id: 4, 
    // Ảnh lớn: khí cầu/địa điểm kỳ lạ (Goreme Valley)
    full: 'https://images.unsplash.com/photo-1548346106-936738156107?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670', 
    thumb: 'https://images.unsplash.com/photo-1548346106-936738156107?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670',
    // thumb: 'https://images.unsplash.com/photo-1524318042571-7ffb2a0c4f92?w=250&h=300&fit=crop', 
    title: 'Goreme Valley' 
  },
];

// ------------------------------------
// 3. Component ImageSlider (TSX)
// ------------------------------------
const ImageSlider: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<ImageItem>(images[0]);
  const [isScaling, setIsScaling] = useState<boolean>(false);

  const handleThumbnailClick = (image: ImageItem) => {
    if (image.id === currentImage.id) return;

    // Kích hoạt hiệu ứng scale-up và fade-out
    setIsScaling(true);

    setTimeout(() => {
      setCurrentImage(image);
      
      // Tắt hiệu ứng scale-up để kích hoạt scale-down và fade-in
      setTimeout(() => {
          setIsScaling(false);
      }, 50); 
      
    }, 150);
  };

  return (
    <div className="image-slider-container">
      
      {/* KHU VỰC ẢNH LỚN */}
      <div className="main-image-wrapper">
        <img
          src={currentImage.full}
          alt={currentImage.title}
          className={`main-image ${isScaling ? 'scaling' : ''}`}
        />
        <div className="main-image-text">
            <p className="location-name">{currentImage.title}</p>
        </div>
      </div>
      
      {/* KHU VỰC THUMBNAILS (ẢNH NHỎ) */}
      <div className="thumbnails-wrapper">
        {images.map((image) => (
          <div
            key={image.id}
            className={`thumbnail-card ${image.id === currentImage.id ? 'active' : ''}`}
            onClick={() => handleThumbnailClick(image)} 
          >
            <img 
              src={image.thumb}
              alt={image.title}
              className="thumbnail-image"
            />
            {/* Hiển thị tiêu đề ảnh nhỏ */}
            <div className="thumbnail-title">{image.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;