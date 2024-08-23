import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Woxsen University - Leave Application Manager",
  description:
    "This web application helps students of Woxsen University to manage and track their leave applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
        {children}
      </body>
    </html>
  );
}
