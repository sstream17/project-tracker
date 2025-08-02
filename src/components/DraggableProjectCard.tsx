"use client";
import { Project } from "@prisma/client";
import { useDraggable } from "@dnd-kit/core";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DraggableProjectCardProps {
  project: Project;
  dragging: boolean;
}

export default function DraggableProjectCard({ project, dragging }: DraggableProjectCardProps) {
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
