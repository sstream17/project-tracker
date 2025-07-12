import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Project Tracker",
  description: "Track your progress in learning and applying new web technologies through side projects.",
};

export default function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {/* TODO: Add summary charts and metrics here */}
      <div className="rounded border p-4 bg-muted text-muted-foreground">
        Summary charts and metrics will appear here.
      </div>
    </main>
  );
}
