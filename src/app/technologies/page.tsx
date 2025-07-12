import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
      <div className="flex flex-wrap gap-2">
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
