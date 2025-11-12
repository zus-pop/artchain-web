"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";

// Styled Components for the Image Dialog
const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 1);
  }
`;

const Frame = styled.div`
  --corner: 1.5em;
  --bg: #8B4513; /* Màu gỗ cho khung tranh */
  --border-width: 2em;
  padding: var(--border-width);
  display: inline-block;
  background-image:
    radial-gradient(calc(2 * var(--corner)) at    0    0, transparent 50%, var(--bg) 50%, var(--bg) 99.99%, transparent 99.99%),
    radial-gradient(calc(2 * var(--corner)) at    0 100%, transparent 50%, var(--bg) 50%, var(--bg) 99.99%, transparent 99.99%),
    radial-gradient(calc(2 * var(--corner)) at 100% 100%, transparent 50%, var(--bg) 50%, var(--bg) 99.99%, transparent 99.99%),
    radial-gradient(calc(2 * var(--corner)) at 100%    0, transparent 50%, var(--bg) 50%, var(--bg) 99.99%, transparent 99.99%),
    linear-gradient(to  right, transparent var(--corner), var(--bg) var(--corner), var(--bg) calc(100% - var(--corner)), transparent calc(100% - var(--corner))),
    linear-gradient(to bottom, transparent var(--corner), var(--bg) var(--corner), var(--bg) calc(100% - var(--corner)), transparent calc(100% - var(--corner)));
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  position: relative;
`;

const StyledImage = styled(Image)`
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0.5em;
  max-width: 800px;
  max-height: 600px;
  object-fit: contain;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
`;

const ImageInfo = styled.div`
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
`;

const ImageTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const ImageDetails = styled.div`
  font-size: 0.875rem;
  color: #423137;
  line-height: 1.4;
`;

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    full: string;
    title: string;
    date?: string;
    school?: string;
    award?: string;
  } | null;
}

const ImageDialog: React.FC<ImageDialogProps> = ({ isOpen, onClose, image }) => {
  if (!isOpen || !image) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <DialogOverlay onClick={handleBackdropClick}>
      <CloseButton onClick={onClose}>&times;</CloseButton>

      <Frame>
        <StyledImage
          src={image.full}
          alt={image.title}
          width={800}
          height={600}
          priority
        />
      </Frame>
    </DialogOverlay>
  );
};

export default ImageDialog;