import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "./components/Navbar";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Grocery List',
  description: 'A collaborative grocery list application'
}

export const themeColor = [
  { media: '(prefers-color-scheme: light)', color: '#f3f4f6' },
  { media: '(prefers-color-scheme: dark)', color: '#1e293b' }
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-gray-300 dark:bg-slate-800`}>
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
