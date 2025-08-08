"use client";
import { Project } from "@prisma/client";
import { ProjectStatus } from "./ProjectSwimlanes";
import { useDroppable } from "@dnd-kit/core";
import DraggableProjectCard from "./DraggableProjectCard";

interface DroppableSwimlaneProps {
  id: ProjectStatus;
  label: string;
  projects: Project[];
  activeId: string | null;
}

export default function DroppableSwimlane({ id, label, projects, activeId }: DroppableSwimlaneProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[280px] rounded-lg p-3 bg-slate-50 border border-slate-200 shadow-sm transition-all ${isOver ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}
    >
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-700 mb-3 px-2 py-1 bg-slate-100 rounded border border-slate-200 text-center">
        {label}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 min-h-[60px]">
        {projects.length === 0 ? (
          <div className="col-span-full text-xs text-gray-400 text-center">No projects</div>
        ) : (
          projects.map((project) => (
            <DraggableProjectCard key={project.id} project={project} dragging={activeId === project.id} />
          ))
        )}
      </div>
    </div>
  );
}
