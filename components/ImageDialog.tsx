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
  /* softer, lighter translucent backdrop */
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(6px) saturate(120%);
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

const ModalBox = styled.div`
  background: rgba(255,255,255,0.98);
  border-radius: 1rem;
  padding: 0.75rem;
  box-shadow: 0 20px 60px rgba(0,0,0,0.12);
  max-width: 1200px;
  width: 100%;
  /* Fixed desktop size to avoid jumping/resizing on open */
  width: 1000px;
  height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* temporarily show only the left image/frame */
  width: 560px;

  @media (max-width: 1100px) {
    width: calc(100% - 48px);
  }

  @media (max-width: 700px) {
    /* On small screens use auto height and stack content */
    width: calc(100% - 24px);
    height: auto;
    padding: 1rem;
  }
`;

const Frame = styled.div`
  /* simple image container (no wooden frame) */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 520px;
  height: 100%;
  background: #f9f7f5;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba(66,49,43,0.06);
  position: relative;
`;

const StyledImage = styled(Image)`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const OverlayPill = styled.div`
  background: rgba(255,255,255,0.95);
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  color: #423137;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
`;

const OverlayTopLeft = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
`;

const OverlayTopRight = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
`;

const OverlayBottomLeft = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
`;

const OverlayBottomRight = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
`;

const BottomBox = styled.div`
  margin-top: 1rem;
  width: 100%;
  background: #fff;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  max-height: 180px;
  overflow: auto;
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

const DialogContent = styled.div`
  display: flex;
  gap: 2rem;
  max-width: 1100px;
  width: 100%;
  align-items: flex-start;
  height: 100%;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    height: auto;
  }
`;

const RightPanel = styled.div`
  flex: 1 1 420px;
  background: #fff;
  /* subtle horizontal stripe pattern (from user example) */
  background-image: linear-gradient(#ffffff 1.1rem, rgba(204,204,204,0.03) 1.2rem);
  background-size: 100% 1.2rem;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  color: #423137;
  height: 100%;
  overflow: auto;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const MetaPill = styled.span`
  background: #f3ede8;
  color: #423137;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
`;

const DetailLabel = styled.div`
  font-size: 0.85rem;
  color: #6b5a53;
  margin-top: 0.75rem;
  font-weight: 600;
`;

const DetailText = styled.p`
  margin: 0.25rem 0 0 0;
  color: #423137;
  line-height: 1.4;
`;

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    full: string;
    title: string;
    paintingTitle?: string;
    date?: string;
    school?: string;
    award?: string | { name?: string; prize?: string; rank?: number } | null;
    description?: string;
    competitor?: { fullName?: string; schoolName?: string; grade?: string } | null;
    addedAt?: string;
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

      {/* wrap in a centered modal box so dialog isn't full-screen black */}
      <ModalBox>
        <Frame>
          <StyledImage
            src={image.full}
            alt={image.title}
            width={800}
            height={600}
            priority
          />

          {/* Overlays at the four corners of the image */}
          <OverlayTopLeft>
            <OverlayPill>
              {image.award && typeof image.award !== "string" ? image.award.name : (image.award || "-")}
            </OverlayPill>
          </OverlayTopLeft>

          <OverlayTopRight>
            <OverlayPill>{image.paintingTitle ?? image.title}</OverlayPill>
          </OverlayTopRight>

          <OverlayBottomLeft>
            <OverlayPill>{image.competitor?.fullName ?? "-"}</OverlayPill>
          </OverlayBottomLeft>

          <OverlayBottomRight>
            <OverlayPill>Ngày công bố: {image.addedAt ? new Date(image.addedAt).toLocaleDateString("vi-VN") : "-"}</OverlayPill>
          </OverlayBottomRight>
        </Frame>
      </ModalBox>
    </DialogOverlay>
  );
};

export default ImageDialog;