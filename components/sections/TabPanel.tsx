import React from "react";

interface TabPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, className = "" }) => {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export default TabPanel;
