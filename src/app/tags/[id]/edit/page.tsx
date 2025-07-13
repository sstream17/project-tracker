import { notFound } from "next/navigation";
import TagForm from "@/components/TagForm";
import { prisma } from "@/lib/prisma";


export default async function EditTagPage({ params }: { params: { id: string } }) {
    const tagId = params.id;
    const tag = await prisma.tag.findUnique({ where: { id: tagId } });
    if (!tag) {
        return notFound();
    }

    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Edit Tag</h1>
            <TagForm tag={tag} />
        </div>
    );
}