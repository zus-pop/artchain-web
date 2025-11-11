"use client";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";

import { useGuardianChildren } from "@/apis/guardian";
import CompetitorProfileScreen from "@/components/me/CompetitorProfile";
import GuardianProfileScreen from "@/components/me/GuardianProfile";
import { useAuth } from "@/hooks/useAuth";

const UserProfilePage = () => {
  const { currentLanguage } = useLanguageStore();
  const t = useTranslation(currentLanguage);

  // Use authUser from useAuth hook
  const { user: authUser } = useAuth();

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
