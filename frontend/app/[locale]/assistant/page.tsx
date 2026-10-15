"use client";

import dynamic from "next/dynamic";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

const AminaAssistantView = dynamic(() => import("@/components/ai/AminaAssistantView"), { ssr: false });

export default function AssistantPage() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <TopBar title="SYS.AI.ASSISTANT // AMINA" />
        <div style={{ height: "calc(100vh - 60px)", overflow: "hidden" }}>
          <AminaAssistantView />
        </div>
      </main>
    </div>
  );
}
