import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tags | Project Tracker",
  description: "Manage your list of tags.",
};

export default async function TagsPage() {
  const tags = await prisma.tag.findMany();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tags</h1>
      <Button asChild>
        <Link href="/tags/new">Add Tag</Link>
      </Button>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link href={`/tags/${tag.id}/edit`} key={tag.id}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{tag.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {tag.description && <p className="text-xs text-muted-foreground">
                  {tag.description}
                </p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
