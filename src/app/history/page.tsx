"use client";

import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { ProjectActivity } from "@/types/project";
import { History, Clock, ArrowRight } from "lucide-react";

export default function HistoryPage() {
  const [activities, setActivities] = useState<ProjectActivity[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(async (data) => {
        if (data.success && data.projects) {
          const allActivities: ProjectActivity[] = [];
          for (const p of data.projects) {
            const res = await fetch(`/api/projects/${p.id}`).then((r) => r.json());
            if (res.activities) allActivities.push(...res.activities);
          }
          // Sort descending by timestamp
          allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setActivities(allActivities);
        }
      });
  }, []);

  return (
    <AppShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <History className="w-5 h-5 text-zinc-400" />
            <span>Workspace Activity & Audit Trail</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Immutable log of all project status changes, research runs, and script approvals.
          </p>
        </div>

        <div className="rounded-2xl bg-[#111117] border border-[#21212e] p-5 space-y-3">
          <div className="space-y-2">
            {activities.length === 0 ? (
              <p className="text-xs text-zinc-500 py-8 text-center">No recent activities logged.</p>
            ) : (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-[#151520] border border-[#232332] text-xs flex items-center justify-between"
                >
                  <div className="space-y-0.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-zinc-400">
                        {act.projectId}
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-[#1e1e2d] text-zinc-400">
                        {act.action}
                      </span>
                    </div>
                    <p className="text-zinc-200">{act.description}</p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                    {new Date(act.timestamp).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
