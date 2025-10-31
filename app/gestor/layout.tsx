'use client';
import "@/styles/globals.css";
import { Providers } from "../providers";
import Header from "@/components/navbar";
import Footer from "@/components/footer";
import Sidebar from "@/components/sidebar";
import clsx from "clsx";
import { useState } from "react";
import { fontSans } from "@/config/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeForm, setActiveForm] = useState<string | null>(null);

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {/* <Header /> */}
          <div className="flex min-h-screen flex-col">
            <div className="flex flex-1">
              <Sidebar
                activeForm={activeForm}
                onFormSelect={setActiveForm}
                className="w-64 min-h-full bg-gray-900 text-white"
              />
              <main className="flex-1 px-6 py-8 bg-gray-50">
                {children}
              </main>
            </div>
            {/* <Footer /> */}
          </div>
        </Providers>
      </body>
    </html>
  );
}
