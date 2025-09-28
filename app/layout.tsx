import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My MTU Schedule",
  description: "A simple PWA for viewing schedules.",
};

const CACHE_VERSION = "3"; // Increment this to force-refresh icons

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={`/favicon.ico?v=${CACHE_VERSION}`} sizes="any" />
        <link rel="manifest" href={`/manifest.webmanifest?v=${CACHE_VERSION}`} />
        <meta name="theme-color" content="#111111" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href={`/icons/app-icon-192.png?v=${CACHE_VERSION}`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`/icons/app-icon-192.png?v=${CACHE_VERSION}`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`/icons/app-icon-192.png?v=${CACHE_VERSION}`} />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
if('serviceWorker'in navigator){
  window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(console.error)});
}`,
          }}
        />
      </body>
    </html>
  );
}