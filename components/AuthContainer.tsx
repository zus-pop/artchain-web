"use client";

import React, { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import styles from "./AuthContainer.module.css";
import ProductScroller from "./ProductScroller";



const Overlay = ({
  isActive,
}: {
  isActive: boolean;
}) => (
  <div className={styles.overlayContainer}>
    <div className={styles.overlay}>
      {!isActive ? (
        <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
          <div className="absolute inset-0">
            <ProductScroller />
          </div>
        </div>
      ) : (
        <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
          <div className="absolute inset-0">
            <ProductScroller />
          </div>
        </div>
      )}
    </div>
  </div>
);

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