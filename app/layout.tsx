import { AuthInitializer } from "@/components/AuthInitializer";
import { ScrollToTop } from "@/components/ScrollToTop";
import ReactQueryProvider from "@/components/react-query-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Be_Vietnam_Pro } from "next/font/google";
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

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "ArtChain - Cuộc thi nghệ thuật",
  description: "Nền tảng cuộc thi vẽ tranh nghệ thuật hàng đầu",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/newlogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/newlogo.png"
        />
        <link rel="apple-touch-icon" href="/images/newlogo.png" />
        <meta name="theme-color" content="#ffffff" />
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
        className={`${geistSans.variable} ${geistMono.variable} ${beVietnamPro.variable} antialiased`}
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
