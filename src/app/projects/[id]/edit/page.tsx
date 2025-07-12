"use client";

import { ProjectStatus } from "@prisma/client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Project {
    id?: string;
    title: string;
    description: string;
    status: ProjectStatus;
    createdAt: Date;
    updatedAt: Date;
}

export default function EditProjectPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string | undefined;
    const [project, setProject] = useState<Project>({ title: "", description: "", status: ProjectStatus.IDEA, createdAt: new Date(), updatedAt: new Date() });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (projectId) {
            setLoading(true);
            fetch(`/api/projects/${projectId}`)
                .then((res) => res.json())
                .then((data) => {
                    setProject(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Failed to load project");
                    setLoading(false);
                });
        }
    }, [projectId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProject({ ...project, status: e.target.value as ProjectStatus });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/projects", {
                method: projectId ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: projectId,
                    title: project.title,
                    description: project.description,
                    status: project.status,
                }),
            });
            if (!res.ok) throw new Error("Failed to save project");
            router.push("/projects");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-4">{projectId ? "Edit Project" : "Add Project"}</h1>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={project.title}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={project.description}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        rows={4}
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Status</label>
                    <select
                        name="status"
                        value={project.status}
                        onChange={handleStatusChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="IDEA">Idea</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="STABLE">Stable</option>
                        <option value="COMPLETE">Complete</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? "Saving..." : projectId ? "Update Project" : "Add Project"}
                </button>
            </form>
        </div>
    );
}
