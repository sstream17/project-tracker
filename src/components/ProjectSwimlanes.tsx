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

export default function ProjectSwimlanes({ projects }: ProjectSwimlanesProps) {
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

    return (
        <div className="flex gap-4 w-full overflow-x-auto">
            {STATUSES.map((status) => (
                <div key={status} className="flex-1 min-w-[250px] bg-white rounded shadow p-2">
                    <h2 className="font-semibold text-center mb-2 border-b pb-1 text-sm uppercase tracking-wide">
                        {STATUS_LABELS[status]}
                    </h2>
                    <div className="flex flex-col gap-2 min-h-[60px]">
                        {projectsByStatus[status].length === 0 ? (
                            <div className="text-xs text-gray-400 text-center">No projects</div>
                        ) : (
                            projectsByStatus[status].map((project) => (
                                <Link href={`/projects/${project.id}/edit`} key={project.id}>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                            <CardTitle className="text-sm font-medium">{project.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {project.description && <p className="text-xs">
                                                {project.description}
                                            </p>}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

