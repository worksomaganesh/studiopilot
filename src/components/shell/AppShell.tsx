"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NewProjectModal } from "@/components/projects/NewProjectModal";
import { useRouter } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const handleProjectCreated = (newProject: { id: string }) => {
    router.push(`/projects/${newProject.id}`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b]">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header onNewProjectClick={() => setIsNewProjectOpen(true)} />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
