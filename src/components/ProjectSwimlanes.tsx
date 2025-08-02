"use client";
import { Project } from "@prisma/client";
import DroppableSwimlane from "./DroppableSwimlane";
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
    DragEndEvent,
    DragOverlay,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
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


