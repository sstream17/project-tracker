"use client";

import { Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TagFormProps = Tag;

export default function TagForm({ tag: initialTag }: { tag?: TagFormProps }) {
    const [tag, setTag] = useState<TagFormProps>(initialTag ?? {
        id: "",
        name: "",
        description: "",
        color: "#e5e7eb",
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTag((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/tags", {
                method: tag.id ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: tag.id,
                    name: tag.name,
                    description: tag.description,
                    color: tag.color,
                }),
            });
            if (!res.ok) throw new Error("Failed to save tag");
            router.push("/tags");
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
                    value={tag.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>
            <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                    name="description"
                    value={tag.description ?? ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    rows={4}
                />
            </div>
            <div>
                <label className="block font-medium mb-1">Color</label>
                <input
                    type="color"
                    name="color"
                    value={tag.color ?? ""}
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
                {loading ? "Saving..." : tag.id ? "Update Tag" : "Add Tag"}
            </button>
        </form>
    );
}
