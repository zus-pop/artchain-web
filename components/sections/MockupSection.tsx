"use client";

import MonitorMockup from "@/components/MonitorMockup";
import PhoneMockup from "@/components/PhoneMockup";
import burberryLogo from "@/public/images/logo1.png";
import myAppLogo from "@/public/images/logo.png";

const MockupSection = () => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 mt-16 w-full px-4">
            {/* Monitor Mockup */}
            <div className="relative transform -rotate-3 transition-transform duration-300">
                <MonitorMockup
                    webScreenshotSrc={burberryLogo}
                    webScreenshotAlt="Website Interface"
                />
            </div>

            {/* Phone Mockup */}
            <div className="relative transform rotate-6 transition-transform duration-300">
                <PhoneMockup appLogoSrc={myAppLogo} appLogoAlt="Mobile App Logo" />
            </div>
        </div>
    );
};

export default MockupSection;