import { notFound } from "next/navigation";
import TechnologyForm from "./TechnologyForm.client";
import { prisma } from "@/lib/prisma";


export default async function EditTechnologyPage({ params }: { params: { id: string } }) {
    const technologyId = params.id;
    const technology = await prisma.technology.findUnique({ where: { id: technologyId }, include: { tags: true } });
    if (!technology) {
        return notFound();
    }

    console.log(technology.tags);
    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Edit Technology</h1>
            <TechnologyForm technology={technology} />
        </div>
    );
}