import TechnologyForm from "@/components/TechnologyForm";


export default async function NewTechnologyPage() {
    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Create New Technology</h1>
            <TechnologyForm />
        </div>
    );
}