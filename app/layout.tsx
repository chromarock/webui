import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chromarock",
  description: "Prediction market dashboard",
  icons: {
    icon: "/assets/rock.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script id="force-dark-mode" strategy="beforeInteractive">
          {`try { document.documentElement.classList.add('dark'); } catch (e) {}`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
