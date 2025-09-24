"use client";

import React, { useState } from "react";
import DatingProfileScroller from "./DatingProfileScroller";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import styles from "./AuthContainer.module.css";



const Overlay = ({
  isActive,
  onToggle,
}: {
  isActive: boolean;
  onToggle: (value: boolean) => void;
}) => (
  <div className={styles.overlayContainer}>
    <div className={styles.overlay}>
      {!isActive ? (
        <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
          <div className="absolute inset-0">
            <DatingProfileScroller />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white z-10">
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-center mb-6 px-8">
              To keep connected with us please login with your personal info
            </p>
            <button
              className={styles.overlayButton}
              onClick={() => onToggle(true)}
              type="button"
            >
              Sign Up
            </button>
          </div>
        </div>
      ) : (
        <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
          <div className="absolute inset-0">
            <DatingProfileScroller />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white z-10">
            <h1 className="text-4xl font-bold mb-4">Hello, Friend!</h1>
            <p className="text-center mb-6 px-8">
              Enter your personal details and start journey with us
            </p>
            <button
              className={styles.overlayButton}
              onClick={() => onToggle(false)}
              type="button"
            >
              Sign In
            </button>
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
              <RegisterForm />
            </div>
          </div>
          <div className={`${styles.formContainer} ${styles.signIn}`}>      
            <div className={styles.form}>
              <LoginForm />
            </div>
          </div>
          <Overlay isActive={isActive} onToggle={setIsActive} />
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;