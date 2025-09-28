import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Screen-Sage",
  description: "PWA demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#111111" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        {/* используем ту же прозрачную иконку; iOS сам подложит фон */}
        <link rel="apple-touch-icon" href="/icons/app-icon-192.png" />
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