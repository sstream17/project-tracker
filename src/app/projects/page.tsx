import ProjectSwimlanes from "@/components/ProjectSwimlanes";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects | Project Tracker",
  description: "View and manage your side projects.",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      technologies: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <Button asChild>
        <Link href="/projects/new">Add Project</Link>
      </Button>
      <ProjectSwimlanes projects={projects} />
    </main>
  );
}

