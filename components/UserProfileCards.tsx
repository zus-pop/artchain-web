// src/components/UserProfileCards.tsx

import React from 'react';

// Định nghĩa kiểu props cho component
interface UserProfileCardsProps {
  birthday: string | undefined;
  ward: string | undefined;
  // Bạn có thể thêm các prop khác nếu cần
}

// Hàm helper để format ngày sinh
const formatBirthday = (isoDate: string | undefined): string => {
  if (!isoDate) return "N/A";
  try {
    const date = new Date(isoDate);
    // Format thành dd/mm/yyyy
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

const UserProfileCards: React.FC<UserProfileCardsProps> = ({ birthday, ward }) => {
  const LocationSvg = (
    <svg 
        className="absolute right-[10%] top-[50%] translate-y-[-50%] opacity-100" 
        viewBox="0 0 24 24" 
        y={0} x={0} height={36} width={36} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 21C15.5 17.5 19 14.7127 19 10.25C19 5.7873 15.866 3 12 3C8.13401 3 5 5.7873 5 10.25C5 14.7127 8.5 17.5 12 21Z" 
        fill="#ffffff" 
        stroke="#ffffff" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.25" r="3" fill="#ffffff"/>
    </svg>
  );

  // SVG cho biểu tượng Lịch (Birthday)
  const CalendarSvg = (
    <svg 
        className="absolute right-[10%] top-[50%] translate-y-[-50%] opacity-100" 
        viewBox="0 0 24 24" 
        y={0} x={0} height={36} width={36} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="6" width="18" height="15" rx="2" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 3L7 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 3L17 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 10L21 10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="grid grid-cols-2 w-full max-w-[700px] mx-auto gap-4 px-3">
      <div className="w-full bg-gray-500 p-5 relative">
        <p className="text-white text-lg font-medium opacity-80">Ngày sinh</p>
        <p className="text-white text-2xl font-bold mt-1">{formatBirthday(birthday)}</p>
        
        {CalendarSvg}
      </div>

      <div className="w-full bg-gray-500 p-5 relative">
        <p className="text-white text-lg font-medium opacity-80">Khu vực</p>
        <p className="text-white text-2xl font-bold mt-1">{ward || "N/A"}</p>
        
        {LocationSvg}
      </div>
    </div>
  );
}

export default UserProfileCards;