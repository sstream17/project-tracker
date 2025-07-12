import { DashboardMetrics } from "@/components/DashboardMetrics";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Project Tracker",
  description: "Track your progress in learning and applying new web technologies through side projects.",
};


export default async function DashboardPage() {
  const projects = await prisma.project.findMany({
    include: {
      technologies: true,
    },
  });

  const technologiesInUse = new Set<string>();
  projects.forEach(project => {
    project.technologies.forEach(tech => {
      technologiesInUse.add(tech.technologyId);
    });
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <DashboardMetrics
        projectCount={projects.length}
        technologiesInUseCount={technologiesInUse.size}
      />
    </main>
  );
}
