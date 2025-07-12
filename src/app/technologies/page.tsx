import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technologies | Project Tracker",
  description: "Manage your list of web technologies.",
};

export default function TechnologiesPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Technologies</h1>
      {/* TODO: Add list, add/edit/delete functionality */}
      <div className="rounded border p-4 bg-muted text-muted-foreground">
        List of technologies will appear here.
      </div>
    </main>
  );
}
