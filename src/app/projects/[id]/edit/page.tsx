import { notFound } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";
import { prisma } from "@/lib/prisma";


export default async function EditProjectPage({ params }: { params: { id: string } }) {
    const projectId = params.id;
    const project = await prisma.project.findUnique({ where: { id: projectId }, include: { technologies: true } });
    if (!project) {
        return notFound();
    }

    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
            <ProjectForm project={project} />
        </div>
    );
}