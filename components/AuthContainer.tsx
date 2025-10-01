"use client";

import React, { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";

const AuthContainer = () => {
  const [isRegister, setIsRegister] = useState(false);
  const { currentLanguage } = useLanguageStore();
  const translations = useTranslation(currentLanguage);

  return (
    <div className="min-h-screen flex justify-center px-4 pt-16 pb-0">
      <div className="w-[95vw] h-[calc(100vh-4rem)] bg-white rounded-t-xl shadow-2xl overflow-hidden">
        <div className="w-full h-full flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-lg">
            {isRegister ? (
              <RegisterForm onToggle={() => setIsRegister(false)} />
            ) : (
              <LoginForm onToggle={() => setIsRegister(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;