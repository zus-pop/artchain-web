"use client";

import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import React from "react";
import Certificate, { CertificateData } from "./Certificate";

interface CertificateViewerProps {
  data: CertificateData;
  backgroundImage?: string;
}

const CertificateViewer: React.FC<CertificateViewerProps> = ({
  data,
  backgroundImage = "/certificate.png",
}) => {
  const certificateRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [downloadError, setDownloadError] = React.useState<string | null>(null);

  const handleDownloadPdf = async () => {
    if (
      typeof window === "undefined" ||
      !certificateRef.current ||
      isDownloading
    ) {
      return;
    }

    const targetNode =
      (certificateRef.current.querySelector(
        "[data-certificate-content]",
      ) as HTMLElement | null) ?? certificateRef.current;

    setIsDownloading(true);
    setDownloadError(null);

    try {
      const safeUserName = data.userName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 40);

      const filename = `${safeUserName || "certificate"}.pdf`;

      const imageData = await toPng(targetNode, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        skipAutoScale: false,
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageProps = pdf.getImageProperties(imageData);
      const imageRatio = imageProps.width / imageProps.height;
      const pageRatio = pageWidth / pageHeight;

      let renderWidth = pageWidth;
      let renderHeight = pageWidth / imageRatio;

      if (imageRatio < pageRatio) {
        renderHeight = pageHeight;
        renderWidth = pageHeight * imageRatio;
      }

      const offsetX = (pageWidth - renderWidth) / 2;
      const offsetY = (pageHeight - renderHeight) / 2;

      pdf.addImage(
        imageData,
        "PNG",
        offsetX,
        offsetY,
        renderWidth,
        renderHeight,
      );
      pdf.save(filename);
    } catch (error) {
      console.error("Certificate PDF download failed", error);
      setDownloadError("Không thể tải PDF. Vui lòng thử lại.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={certificateRef}
        data-pdf-capture
        className="relative mx-auto w-full max-w-5xl"
      >
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="absolute -top-14 right-0 z-20 inline-flex cursor-pointer items-center rounded bg-[#423137] px-3 py-1.5 text-xs font-medium text-white shadow-md hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-2 sm:text-sm"
        >
          {isDownloading ? "Đang tạo PDF..." : "Tải PDF"}
        </button>

        <Certificate data={data} backgroundImage={backgroundImage} />
      </div>

      {downloadError && (
        <p className="text-sm text-red-600" role="alert">
          {downloadError}
        </p>
      )}
    </div>
  );
};

export default CertificateViewer;
