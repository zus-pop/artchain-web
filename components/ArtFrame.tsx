'use client'

import Image from 'next/image';

interface ArtFrameProps {
  artworkSrc: string;
  artworkTitle: string;
  artistName: string;
  frameStyle?: 'gold' | 'silver' | 'wood' | 'modern';
}

export default function ArtFrame({ 
  artworkSrc, 
  artworkTitle, 
  artistName, 
  frameStyle = 'gold' 
}: ArtFrameProps) {
  const frameStyles = {
    gold: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-yellow-500/50',
    silver: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 shadow-gray-400/50',
    wood: 'bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 shadow-amber-700/50',
    modern: 'bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 shadow-slate-700/50'
  };

  return (
    <div className={`relative p-4 rounded-lg shadow-2xl ${frameStyles[frameStyle]} transform hover:scale-105 transition-transform duration-300`}>
      {/* Inner frame */}
      <div className="relative bg-white p-2 rounded shadow-inner">
        {/* Artwork */}
        <div className="relative w-64 h-80 overflow-hidden rounded">
          <Image
            src={artworkSrc}
            alt={artworkTitle}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Artwork info */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white p-3 rounded-b">
          <h3 className="font-bold text-sm truncate">{artworkTitle}</h3>
          <p className="text-xs text-gray-300 truncate">Nghệ sĩ: {artistName}</p>
        </div>
      </div>
      
      {/* Hanging wire effect */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
        <div className="w-8 h-1 bg-gray-600 rounded-full shadow-lg"></div>
      </div>
    </div>
  );
}