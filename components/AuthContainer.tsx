"use client";

import React, { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import styles from "./AuthContainer.module.css";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";



const Overlay = ({
  isActive,
}: {
  isActive: boolean;
}) => {
  const { currentLanguage } = useLanguageStore();
  const translations = useTranslation(currentLanguage);
  
  return (
    <div className={styles.overlayContainer}>
      <div className={styles.overlay}>
        {!isActive ? (
          <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
            <div className="absolute inset-0">
              <Image 
                src="https://images.unsplash.com/photo-1548811579-017cf2a4268b?q=80&w=989&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Art Competition"
                fill
                className="object-cover"
                sizes="50vw"
                priority
              />
              {/* Enhanced dark overlay for better text visibility */}
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50" />
              {/* Text with stronger background */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                <div className="text-center bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <h2 className="text-4xl font-bold mb-4 text-center text-white drop-shadow-2xl">{translations.welcomeBack}</h2>
                  <div className="w-16 h-1 bg-blue-400 mx-auto mb-4 rounded-full"></div>
                  <p className="text-xl text-center text-white/95 drop-shadow-lg font-medium">
                    {translations.continueJourney}
                  </p>
                  <p className="text-lg text-center text-white/90 mt-2 drop-shadow-md">
                    {translations.signInAccess}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
            <div className="absolute inset-0">
              <Image 
                src="https://images.unsplash.com/photo-1548811579-017cf2a4268b?q=80&w=989&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Digital Art"
                fill
                className="object-cover"
                sizes="50vw"
                priority
              />
              {/* Enhanced dark overlay for better text visibility */}
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 bg-gradient-to-l from-purple-900/50 to-blue-900/50" />
              {/* Text with stronger background */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                <div className="text-center bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <h2 className="text-4xl font-bold mb-4 text-center text-white drop-shadow-2xl">{translations.joinArtChain}</h2>
                  <div className="w-16 h-1 bg-purple-400 mx-auto mb-4 rounded-full"></div>
                  <p className="text-xl text-center text-white/95 drop-shadow-lg font-medium">
                    {translations.competeCreate}
                  </p>
                  <p className="text-lg text-center text-white/90 mt-2 drop-shadow-md">
                    {translations.premierPlatform}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AuthContainer = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={styles.full}>
      <div className={styles.wrapper}>
        <div className={`${styles.container} ${isActive ? styles.active : ""}`}>
          <div className={`${styles.formContainer} ${styles.signUp}`}>
            <div className={styles.form}>
              <RegisterForm onToggle={() => setIsActive(false)} />
            </div>
          </div>
          <div className={`${styles.formContainer} ${styles.signIn}`}>      
            <div className={styles.form}>
              <LoginForm onToggle={() => setIsActive(true)} />
            </div>
          </div>
          <Overlay isActive={isActive} />
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;