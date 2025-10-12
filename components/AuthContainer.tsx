"use client";

import React, { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import Image from "next/image";
// import { useTranslation } from "@/lib/i18n";
// import { useLanguageStore } from "@/store/language-store";

const AuthContainer = () => {
  const [isRegister, setIsRegister] = useState(false);
  // const { currentLanguage } = useLanguageStore();
  // const translations = useTranslation(currentLanguage);

  return (
    <div className="min-h-screen flex justify-center px-4 pt-16 pb-0"
    style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80')"
      }}>
      <div className="w-[95vw] h-[calc(100vh-4rem)] bg-white rounded-t-xl shadow-2xl overflow-hidden">
        <div className="w-full h-full flex">
          {/* CỘT 1: LOGO (Ẩn trên màn hình nhỏ) */}
          <div className="hidden lg:flex w-1/2 items-center justify-center p-12 bg-gray-50">
            <Image
              // Đường dẫn bắt đầu bằng dấu "/" để trỏ vào thư mục public
              src="/images/Mu.png" 
              alt="Company Logo"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>

          {/* CỘT 2: FORM ĐĂNG NHẬP / ĐĂNG KÝ */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md">
              {isRegister ? (
                <RegisterForm onToggle={() => setIsRegister(false)} />
              ) : (
                <LoginForm onToggle={() => setIsRegister(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;