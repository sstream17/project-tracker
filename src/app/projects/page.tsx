import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Project Tracker",
  description: "View and manage your side projects.",
};

export default function ProjectsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <Button asChild>
        <Link href="/projects/new">Add Project</Link>
      </Button>
      <div className="rounded border p-4 bg-muted text-muted-foreground">
        Swimlanes of projects by status will appear here.
      </div>
    </main>
  );
}
