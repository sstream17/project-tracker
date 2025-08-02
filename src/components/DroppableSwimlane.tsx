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
      className={`flex-1 min-w-[250px] bg-white rounded shadow p-2 transition-all ${isOver ? "ring-2 ring-blue-400" : ""}`}
    >
      <h2 className="font-semibold text-center mb-2 border-b pb-1 text-sm uppercase tracking-wide">
        {label}
      </h2>
      <div className="flex flex-col gap-2 min-h-[60px]">
        {projects.length === 0 ? (
          <div className="text-xs text-gray-400 text-center">No projects</div>
        ) : (
          projects.map((project) => (
            <DraggableProjectCard key={project.id} project={project} dragging={activeId === project.id} />
          ))
        )}
      </div>
    </div>
  );
}
