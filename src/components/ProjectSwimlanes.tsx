"use client";
import { Project } from "@prisma/client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export type ProjectStatus = "IDEA" | "IN_PROGRESS" | "STABLE" | "COMPLETE";

const STATUSES: ProjectStatus[] = [
    "IDEA",
    "IN_PROGRESS",
    "STABLE",
    "COMPLETE"
];

const STATUS_LABELS: Record<ProjectStatus, string> = {
    IDEA: "Idea",
    IN_PROGRESS: "In Progress",
    STABLE: "Stable",
    COMPLETE: "Complete"
};

interface ProjectSwimlanesProps {
    projects: Project[];
}

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { useState } from "react";

export default function ProjectSwimlanes({ projects: initialProjects }: ProjectSwimlanesProps) {
    // Local state for drag-and-drop
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Group projects by status
    const projectsByStatus: Record<ProjectStatus, Project[]> = {
        IDEA: [],
        IN_PROGRESS: [],
        STABLE: [],
        COMPLETE: []
    };
    projects.forEach((project) => {
        projectsByStatus[project.status]?.push(project);
    });

    // dnd-kit sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    function handleDragStart(event: any) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);
        if (!over || !active) return;
        const projectId = active.id as string;
        const newStatus = over.id as ProjectStatus;
        const project = projects.find((p) => p.id === projectId);
        if (project && project.status !== newStatus) {
            setProjects((prev) =>
                prev.map((p) =>
                    p.id === projectId ? { ...p, status: newStatus } : p
                )
            );
            // TODO: Optionally call API to persist change
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 w-full overflow-x-auto">
                {STATUSES.map((status) => (
                    <DroppableSwimlane
                        key={status}
                        id={status}
                        label={STATUS_LABELS[status]}
                        projects={projectsByStatus[status]}
                        activeId={activeId}
                    />
                ))}
            </div>
            <DragOverlay>
                {activeId ? (
                    (() => {
                        const project = projects.find((p) => p.id === activeId);
                        if (!project) return null;
                        return (
                            <Card className="border-2 border-blue-400 opacity-90">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-sm font-medium">{project.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {project.description && <p className="text-xs">{project.description}</p>}
                                </CardContent>
                            </Card>
                        );
                    })()
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

// Droppable swimlane
import { useDroppable, useDraggable } from "@dnd-kit/core";

function DroppableSwimlane({ id, label, projects, activeId }: {
    id: ProjectStatus;
    label: string;
    projects: Project[];
    activeId: string | null;
}) {
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

function DraggableProjectCard({ project, dragging }: { project: Project; dragging: boolean }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: project.id,
    });
    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={{ opacity: dragging || isDragging ? 0.5 : 1 }}>
            <Link href={`/projects/${project.id}/edit`} tabIndex={-1}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {project.description && <p className="text-xs">{project.description}</p>}
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
}


