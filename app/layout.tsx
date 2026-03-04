import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from 'sonner'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { SessionProvider } from "@/components/session -provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat With PDF ",
  description: "your PDF reader",
};

export default async function RootLayout({ children,}: Readonly<{children: React.ReactNode;}>){
  const session = await auth.api.getSession({ headers: await headers() });
  
  return (
    <html lang="en" className="">
      <SessionProvider initialSession={session}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster/>
          <Header />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </body>
      </SessionProvider>
    </html>
  );
}
