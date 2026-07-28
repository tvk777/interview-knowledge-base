"use client";

import { Sheet } from "@/components/ui/sheet";
import Content from "@/components/content/Content";
import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";

export default function AppLayout() {
  return (
    <Sheet>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Content />
        </div>
      </div>
    </Sheet>
  );
}
