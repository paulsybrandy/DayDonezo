import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "../globals.css";
import Header from "@/components/Layout/header";
import { Const } from "@/lib/contants";
import Footer from "@/components/Layout/footer";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistMono = Rubik({
  variable: "--font-sans",
  weight: ["400"],
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: Const.APP_NAME,
  description: Const.APP_DESCRIPTION,
};

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} font-sans antialiased bg-background min-h-screen`}
      >
        <main className="flex flex-col min-h-screen">
          <Header />
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
          <Footer />
          <Toaster />
        </main>
      </body>
    </html>
  );
}
