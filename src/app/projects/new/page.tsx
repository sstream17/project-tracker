import ProjectForm from "@/components/ProjectForm";


export default async function NewProjectPage() {
    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
            <ProjectForm />
        </div>
    );
}