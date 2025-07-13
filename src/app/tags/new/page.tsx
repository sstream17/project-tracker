import TagForm from "@/components/TagForm";


export default async function NewTagPage() {
    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">Create New Tag</h1>
            <TagForm />
        </div>
    );
}