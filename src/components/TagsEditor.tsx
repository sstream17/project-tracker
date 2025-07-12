// import { Combobox, ComboboxInput, ComboboxContent, ComboboxItem, ComboboxEmpty, ComboboxTrigger, ComboboxList } from "@/components/ui/combobox";
// import { Check, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Tag } from "@prisma/client";

interface TagsEditorProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  disabled?: boolean;
}

export default function TagsEditor({ value, onChange, disabled }: TagsEditorProps) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/tags")
      .then((res) => res.json())
      .then((tags) => setAllTags(tags))
      .finally(() => setLoading(false));
  }, []);

  const filtered = input
    ? allTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(input.toLowerCase()) &&
          !value.some((t) => t.id === tag.id)
      )
    : allTags.filter((tag) => !value.some((t) => t.id === tag.id));

  const isNewTag =
    input.length > 0 &&
    !allTags.some((tag) => tag.name.toLowerCase() === input.toLowerCase());

  const handleSelectTag = (tag: Tag) => {
    onChange([...value, tag]);
    setInput("");
  };

  const handleRemoveTag = (id: string) => {
    onChange(value.filter((tag) => tag.id !== id));
  };

  const handleCreateTag = async (name: string) => {
    setCreating(true);
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create tag");
      const tag = await res.json();
      setAllTags((tags) => [...tags, tag]);
      onChange([...value, tag]);
      setInput("");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
        <label className="block font-medium mb-1">Tags</label>
      <div className="bg-muted border border-border rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
          {value.map((tag) => (
            <span
              key={tag.id}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: tag.color || "#e5e7eb", color: "#111" }}
            >
              {tag.name}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-1 text-xs text-muted-foreground hover:text-destructive focus:outline-none"
                  aria-label={`Remove ${tag.name}`}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
        {/* Combobox UI - replace with shadcn/ui Combobox primitives */}
        <div className="relative">
          {/* <Combobox> */}
            {/* <ComboboxInput /> */}
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={loading ? "Loading..." : "Search or create tag..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={disabled || loading || creating}
            />
            {(filtered.length > 0 || isNewTag) && input && (
              <div className="absolute left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-20 max-h-56 overflow-auto">
                {filtered.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-accent focus:bg-accent text-left"
                    style={{ color: tag.color || undefined }}
                    onClick={() => handleSelectTag(tag)}
                    disabled={disabled}
                  >
                    {/* <Check className="mr-2 h-4 w-4 opacity-0 group-data-[selected]:opacity-100" /> */}
                    <span className="block font-medium">{tag.name}</span>
                    {tag.description && (
                      <span className="ml-2 text-xs text-muted-foreground">{tag.description}</span>
                    )}
                  </button>
                ))}
                {isNewTag && (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-800"
                    onClick={() => handleCreateTag(input)}
                    disabled={creating || disabled}
                  >
                    {/* <Plus className="h-4 w-4" /> */}
                    {creating ? "Creating..." : `Create new tag: "${input}"`}
                  </button>
                )}
              </div>
            )}
          {/* </Combobox> */}
        </div>
      </div>
    </>
  );
}
