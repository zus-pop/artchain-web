import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/components/react-query-provider";
import { AuthInitializer } from "@/components/AuthInitializer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        <style dangerouslySetInnerHTML={{
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
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReactQueryProvider>
          <AuthInitializer>
            <Toaster richColors />
            <div className="fixed inset-0 -z-10">
            </div>
            {/* <Header2 /> */}
            <main className="relative z-10">
              {children}
            </main>
          </AuthInitializer>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
