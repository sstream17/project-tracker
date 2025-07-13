import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Technologies | Project Tracker",
  description: "Manage your list of web technologies.",
};

export default async function TechnologiesPage() {
  const technologies = await prisma.technology.findMany();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Technologies</h1>
      <Button asChild>
        <Link href="/technologies/new">Add Technology</Link>
      </Button>
      <div className="flex flex-wrap gap-2 p-4">
        {technologies.map((technology) => (
          <Link href={`/technologies/${technology.id}/edit`} key={technology.id}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{technology.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {technology.description && <p className="text-xs text-muted-foreground">
                  {technology.description}
                </p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
