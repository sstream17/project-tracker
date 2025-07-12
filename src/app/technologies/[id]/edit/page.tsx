"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Technology {
    id?: string;
    name: string;
    description: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export default function EditTechnologyPage() {
    const router = useRouter();
    const params = useParams();
    const technologyId = params.id as string | undefined;
    const [technology, setTechnology] = useState<Technology>({ name: "", description: "", tags: [], createdAt: new Date(), updatedAt: new Date() });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (technologyId) {
            setLoading(true);
            fetch(`/api/technologies/${technologyId}`)
                .then((res) => res.json())
                .then((data) => {
                    setTechnology(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Failed to load technology");
                    setLoading(false);
                });
        }
    }, [technologyId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTechnology({ ...technology, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/technologies", {
                method: technologyId ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: technologyId,
                    name: technology.name,
                    description: technology.description,
                }),
            });
            if (!res.ok) throw new Error("Failed to save technology");
            router.push("/technologies");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">{technologyId ? "Edit Technology" : "Add Technology"}</h1>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={technology.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={technology.description}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        rows={4}
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Tags</label>
                    <input
                        type="text"
                        name="tags"
                        value={technology.tags?.join(",")}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? "Saving..." : technologyId ? "Update Technology" : "Add Technology"}
                </button>
            </form>
        </div>
    );
}
