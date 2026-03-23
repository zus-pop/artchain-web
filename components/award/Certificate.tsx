import React from "react";

export interface CertificateData {
  userName: string;
  awardName: string;
  awardRank?: number | string | null;
  contestName: string;
  date: string;
  certificateId: string;
  description?: string;
}

interface CertificateProps {
  data: CertificateData;
  backgroundImage: string;
}

const Certificate: React.FC<CertificateProps> = ({ data, backgroundImage }) => {
  const rankText =
    data.awardRank !== null &&
    data.awardRank !== undefined &&
    data.awardRank !== ""
      ? ` (Rank ${data.awardRank})`
      : "";

  const contentLine = data.description
    ? data.description
    : `Completed the contest ${data.contestName} and received ${data.awardName}${rankText}.`;

  const medalText =
    data.awardRank !== null &&
    data.awardRank !== undefined &&
    data.awardRank !== ""
      ? `Rank ${data.awardRank}`
      : data.awardName;

  const playfulNameFont = {
    fontFamily: '"Comic Sans MS", "Trebuchet MS", cursive',
  } as const;

  const playfulBodyFont = {
    fontFamily: '"Trebuchet MS", "Comic Sans MS", sans-serif',
  } as const;

  return (
    <div
      data-certificate-content
      className="relative w-full overflow-hidden rounded"
      style={{
        aspectRatio: "1086 / 768",
        border: "1px solid #d1d5db",
        backgroundColor: "#ffffff",
        color: "#000000",
      }}
    >
      <img
        src={backgroundImage}
        alt="Certificate template"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div
        className="absolute left-1/2 top-[19.6%] -translate-x-1/2 text-center text-[clamp(12px,1.25vw,16px)] font-bold text-[#c78b00]"
        style={playfulBodyFont}
      >
        {medalText}
      </div>

      <div
        className="absolute left-[20%] top-[48.3%] w-[60%] text-center text-[clamp(28px,3.6vw,52px)] font-bold text-[#517f2f]"
        style={playfulNameFont}
      >
        {data.userName}
      </div>

      <div
        className="absolute left-[20%] top-[60.8%] w-[60%] text-center text-[clamp(12px,1.2vw,16px)] font-semibold text-[#4e8a34]"
        style={playfulBodyFont}
      >
        {data.awardName}
      </div>

      <div
        className="absolute left-[20%] top-[65.2%] w-[60%] text-center text-[clamp(10px,1.02vw,13px)] text-[#2e2e2e]"
        style={playfulBodyFont}
      >
        {contentLine}
      </div>

      <div
        className="absolute right-[10%] top-[14%] text-[clamp(11px,1.1vw,14px)] font-semibold text-[#3f7a2f]"
        style={playfulBodyFont}
      >
        {data.date}
      </div>
    </div>
  );
};

export default Certificate;
