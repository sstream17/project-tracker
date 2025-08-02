"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectStatus, Technology } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import MultiSelectItemInput from "./MultiSelectItemInput";

type FormData = {
  id?: string;
  title: string;
  description: string;
  status: ProjectStatus;
  technologies: Technology[];
  createdAt?: Date;
  updatedAt?: Date;
};

const projectFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().min(1, "Description is required").max(1000, "Description is too long").optional(),
  status: z.enum(["IDEA", "IN_PROGRESS", "STABLE", "COMPLETE"]).optional(),
  technologies: z.array(z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

type ProjectFormProps = {
  project?: Partial<FormData>;
};

export default function ProjectForm({ project: initialProject }: ProjectFormProps) {
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      id: initialProject?.id || "",
      title: initialProject?.title || "",
      description: initialProject?.description || "",
      status: initialProject?.status || "IDEA",
      technologies: initialProject?.technologies || [],
      createdAt: initialProject?.createdAt || new Date(),
      updatedAt: initialProject?.updatedAt || new Date(),
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const res = await fetch("/api/projects", {
        method: data.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.id,
          title: data.title,
          description: data.description,
          status: data.status,
          technologies: data.technologies?.map((technology: Technology) => technology.id) || [],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save project");
      }

      router.push("/projects");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const currentTechnologies = watch("technologies") as Technology[] || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          className={`w-full border rounded px-3 py-2 ${errors.title ? "border-red-500" : "border-gray-300"
            }`}
          {...register("title")}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block font-medium mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          className={`w-full border rounded px-3 py-2 ${errors.description ? "border-red-500" : "border-gray-300"
            }`}
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <MultiSelectItemInput<Technology>
          value={currentTechnologies}
          onChange={(technologies) => setValue("technologies", technologies, { shouldValidate: true })}
          fetchUrl="/api/technologies"
          createUrl="/api/technologies"
          label="Technologies"
          placeholder="Search or create technology..."
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : initialProject?.id ? "Update Project" : "Add Project"}
        </button>
      </div>
    </form>
  );
}
