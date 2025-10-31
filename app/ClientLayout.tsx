"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [activeForm, setActiveForm] = useState<string | null>(null);

  return (
    <div className="relative flex flex-row h-screen">
      {/* <Sidebar
        activeForm={activeForm}
        onFormSelect={setActiveForm}
        className=""
      /> */}
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
    </div>
  );
}