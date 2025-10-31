import { AuthInitializer } from "@/components/AuthInitializer";
import { ScrollToTop } from "@/components/ScrollToTop";
import ReactQueryProvider from "@/components/react-query-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  title: "ArtChain - Cuộc thi nghệ thuật",
  description: "Nền tảng cuộc thi vẽ tranh nghệ thuật hàng đầu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* View Transitions API for smooth navigation */
            @view-transition {
              navigation: auto;
            }
            
            /* Instant page transitions */
            ::view-transition-old(root),
            ::view-transition-new(root) {
              animation-duration: 0ms;
            }
            
            /* Preload hover optimization */
            a:hover {
              cursor: pointer;
            }
          `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          <AuthInitializer>
            <ScrollToTop />
            <Toaster richColors />
            <div className="fixed inset-0 -z-10"></div>
            {/* <HeaderWrapper /> */}
            <main className="relative z-10">{children}</main>
          </AuthInitializer>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
