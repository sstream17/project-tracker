import React, { useEffect, useState } from "react";

type Item = { id: string; name: string };

interface TagsEditorProps<T extends Item> {
  value: T[];
  onChange: (items: T[]) => void;
  disabled?: boolean;
  fetchUrl: string;
  createUrl: string;
  label: string;
  placeholder?: string;
  itemLabel?: (item: T) => React.ReactNode;
}

export default function MultiSelectItemInput<T extends Item>({ value, onChange, disabled, fetchUrl, createUrl, label, placeholder = "Search or create...", itemLabel }: TagsEditorProps<T>) {
  const [allItems, setAllItems] = useState<T[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((items) => setAllItems(items))
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  const filtered = input
    ? allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(input.toLowerCase()) &&
          !value.some((t) => t.id === item.id)
      )
    : allItems.filter((item) => !value.some((t) => t.id === item.id));

  const isNewItem =
    input.length > 0 &&
    !allItems.some((item) => item.name.toLowerCase() === input.toLowerCase());

  const handleSelectItem = (item: T) => {
    onChange([...value, item]);
    setInput("");
  };

  const handleRemoveItem = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const handleCreateItem = async (name: string) => {
    setCreating(true);
    try {
      const res = await fetch(createUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create item");
      const item = await res.json();
      setAllItems((items) => [...items, item]);
      onChange([...value, item]);
      setInput("");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <label className="block font-medium mb-1">{label}</label>
      <div className="bg-muted border border-border rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
          {value.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-200"
            >
              {itemLabel ? itemLabel(item) : item.name}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="ml-1 text-xs text-muted-foreground hover:text-destructive focus:outline-none"
                  aria-label={`Remove ${item.name}`}
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
            placeholder={loading ? "Loading..." : placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled || loading || creating}
          />
          {(filtered.length > 0 || isNewItem) && input && (
            <div className="absolute left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-20 max-h-56 overflow-auto">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-accent focus:bg-accent text-left"
                  onClick={() => handleSelectItem(item)}
                  disabled={disabled}
                >
                  <span className="block font-medium">{itemLabel ? itemLabel(item) : item.name}</span>
                </button>
              ))}
              {isNewItem && (
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-800"
                  onClick={() => handleCreateItem(input)}
                  disabled={creating || disabled}
                >
                  {creating ? "Creating..." : `Create new: "${input}"`}
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
