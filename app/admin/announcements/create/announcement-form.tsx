"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Item = { id: string; name: string };

export function AnnouncementForm({
  programmes,
  levels,
  classes,
}: {
  programmes: Item[];
  levels: Item[];
  classes: Item[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [titleArabic, setTitleArabic] = useState("");
  const [content, setContent] = useState("");
  const [contentArabic, setContentArabic] = useState("");
  const [target, setTarget] = useState("everyone");
  const [targetId, setTargetId] = useState("");
  const [publishNow, setPublishNow] = useState(true);

  const needsTargetId = ["programme", "level", "class"].includes(target);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          titleArabic: titleArabic || null,
          content,
          contentArabic: contentArabic || null,
          target,
          targetId: needsTargetId ? targetId : null,
          isPublished: publishNow,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to create");
        setLoading(false);
        return;
      }

      router.push("/admin/announcements");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  const targetOptions =
    target === "programme" ? programmes : target === "level" ? levels : target === "class" ? classes : [];

  return (
    <form onSubmit={handleSubmit} className="paper-card p-8 rounded-lg space-y-6">
      {error && (
        <div
          className="p-3 rounded text-sm"
          style={{ background: "hsl(0, 50%, 95%)", color: "hsl(0, 60%, 42%)" }}
        >
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <Label>Title (English) *</Label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded border"
          style={{ borderColor: "hsl(35, 20%, 82%)" }}
        />
      </div>

      <div>
        <Label>Title (Arabic)</Label>
        <input
          type="text"
          dir="rtl"
          value={titleArabic}
          onChange={(e) => setTitleArabic(e.target.value)}
          className="w-full px-3 py-2 rounded border arabic-text"
          style={{ borderColor: "hsl(35, 20%, 82%)" }}
        />
      </div>

      {/* Content */}
      <div>
        <Label>Content (English) *</Label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 rounded border"
          style={{ borderColor: "hsl(35, 20%, 82%)" }}
        />
      </div>

      <div>
        <Label>Content (Arabic)</Label>
        <textarea
          dir="rtl"
          value={contentArabic}
          onChange={(e) => setContentArabic(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 rounded border arabic-text"
          style={{ borderColor: "hsl(35, 20%, 82%)" }}
        />
      </div>

      {/* Target */}
      <div>
        <Label>Target Audience *</Label>
        <select
          value={target}
          onChange={(e) => {
            setTarget(e.target.value);
            setTargetId("");
          }}
          className="w-full px-3 py-2 rounded border"
          style={{ borderColor: "hsl(35, 20%, 82%)" }}
        >
          <option value="everyone">Everyone</option>
          <option value="students">All Students</option>
          <option value="teachers">All Teachers</option>
          <option value="programme">Specific Programme</option>
          <option value="level">Specific Level</option>
          <option value="class">Specific Class</option>
        </select>
      </div>

      {needsTargetId && (
        <div>
          <Label>
            Select {target.charAt(0).toUpperCase() + target.slice(1)} *
          </Label>
          <select
            required
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full px-3 py-2 rounded border"
            style={{ borderColor: "hsl(35, 20%, 82%)" }}
          >
            <option value="">— Choose —</option>
            {targetOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
          {targetOptions.length === 0 && (
            <p className="text-xs mt-1" style={{ color: "hsl(0, 60%, 42%)" }}>
              None available. Create one first.
            </p>
          )}
        </div>
      )}

      {/* Publish toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="publish"
          checked={publishNow}
          onChange={(e) => setPublishNow(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="publish" style={{ color: "hsl(0, 0%, 8%)", fontWeight: 500 }}>
          Publish immediately (students see it right away)
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded-md"
          style={{
            background: "hsl(0, 0%, 8%)",
            color: "white",
            fontWeight: 600,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Saving..." : publishNow ? "Publish Announcement" : "Save Draft"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-3 rounded-md"
          style={{
            border: "1.5px solid hsl(0, 0%, 8%)",
            color: "hsl(0, 0%, 8%)",
            fontWeight: 600,
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block mb-1.5 text-sm"
      style={{ color: "hsl(0, 0%, 18%)", fontWeight: 600 }}
    >
      {children}
    </label>
  );
}