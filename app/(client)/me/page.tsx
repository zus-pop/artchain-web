"use client";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";
import { WhoAmI } from "@/types";

import { useGuardianChildren } from "@/apis/guardian";
import CompetitorProfileScreen from "@/components/me/CompetitorProfile";
import GuardianProfileScreen from "@/components/me/GuardianProfile";
import { useEffect, useState } from "react";

const UserProfilePage = () => {
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // State để lưu trữ thông tin người dùng
  const [authUser, setAuthUser] = useState<WhoAmI | null>(null);

  // useEffect để đọc dữ liệu từ localStorage
  useEffect(() => {
    try {
      // Lấy chuỗi JSON từ localStorage
      const userString = localStorage.getItem("auth-user");
      if (userString) {
        // Parse chuỗi JSON thành object
        const userData: WhoAmI = JSON.parse(userString);
        setAuthUser(userData);
      }
    } catch (error) {
      console.error("Error reading 'auth-user' from localStorage:", error);
      setAuthUser(null); // Đặt null nếu có lỗi
    }
  }, []); // [] đảm bảo chỉ chạy một lần khi component mount

  // Fetch guardian children if user is a guardian
  const { data: guardianChildren, isLoading: isLoadingChildren } =
    useGuardianChildren(
      authUser?.role === "GUARDIAN" ? authUser.userId : undefined
    );

  return (
    <>
      {authUser?.role === "GUARDIAN" ? (
        // GUARDIAN PROFILE SCREEN
        <GuardianProfileScreen
          authUser={authUser}
          guardianChildren={guardianChildren}
          isLoadingChildren={isLoadingChildren}
        />
      ) : (
        // COMPETITOR PROFILE SCREEN
        <CompetitorProfileScreen authUser={authUser} t={t} />
      )}
    </>
  );
};

export default UserProfilePage;
