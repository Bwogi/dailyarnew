// app/layout.tsx
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Daily Activity & Duty Management System",
  description:
    "Professional security duty management and incident reporting system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="mx-auto h-full">
            <main className="page-transition">{children}</main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
