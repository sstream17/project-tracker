"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const tagFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

type TagFormValues = z.infer<typeof tagFormSchema>;

type TagFormProps = {
  tag?: TagFormValues;
};

export default function TagForm({ tag: initialTag }: TagFormProps) {
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: initialTag || {
      id: "",
      name: "",
      description: "",
      color: "#e5e7eb",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const onSubmit = async (data: TagFormValues) => {
    try {
      const res = await fetch("/api/tags", {
        method: data.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save tag");
      }

      router.push("/tags");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block font-medium mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          className={`w-full border rounded px-3 py-2 ${errors.name ? "border-red-500" : "border-gray-300"
            }`}
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block font-medium mb-1">
          Description
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
        <label htmlFor="color" className="block font-medium mb-1">
          Color <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            id="color"
            type="color"
            className="h-10 w-16 cursor-pointer"
            {...register("color")}
          />
          <input
            type="text"
            className={`flex-1 border rounded px-3 py-2 font-mono ${errors.color ? "border-red-500" : "border-gray-300"
              }`}
            value={watch("color")}
            onChange={(e) => setValue("color", e.target.value)}
          />
        </div>
        {errors.color && (
          <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : initialTag?.id ? "Update Tag" : "Add Tag"}
        </button>
      </div>
    </form>
  );
}
