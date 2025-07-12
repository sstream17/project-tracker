"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Technology, Tag } from "@prisma/client";
import TagsEditor from "./TagsEditor";

type TechnologyFormProps = Technology & {
    tags?: Tag[];
};

export default function TechnologyForm({ technology: initialTechnology }: { technology?: TechnologyFormProps }) {
    const [technology, setTechnology] = useState<TechnologyFormProps>(initialTechnology ?? {
        id: "",
        name: "",
        description: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTechnology((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/technologies", {
                method: technology.id ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: technology.id,
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
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 mb-2">{error}</div>}
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
                    value={technology.description ?? ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    rows={4}
                    required
                />
            </div>
            <div>
                <TagsEditor value={technology.tags ?? []} onChange={(tags) => setTechnology({ ...technology, tags })} />
            </div>
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? "Saving..." : technology.id ? "Update Technology" : "Add Technology"}
            </button>
        </form>
    );
}
