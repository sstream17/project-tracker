import { notFound } from "next/navigation";
import TechnologyForm from "@/components/TechnologyForm";
import { prisma } from "@/lib/prisma";


export default async function NewTechnologyPage({ params }: { params: { id: string } }) {
    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Create New Technology</h1>
            <TechnologyForm  />
        </div>
    );
}