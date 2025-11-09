"use client";

import React, { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
// Image không còn cần thiết ở đây nữa
// import Image from "next/image"; 

const AuthContainer = () => {
  const [isRegister, setIsRegister] = useState(false);

  // Container này không tạo ra bất kỳ giao diện nào (không có thẻ div,
  // không có nền, không có card).
  // Nó chỉ đơn giản là một bộ chuyển đổi logic để hiển thị
  // LoginForm hoặc RegisterForm (vốn đã là các layout tràn viền).
  
  if (isRegister) {
    return <RegisterForm onToggle={() => setIsRegister(false)} />;
  }
  
  return <LoginForm onToggle={() => setIsRegister(true)} />;
};

export default AuthContainer;