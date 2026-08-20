"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Item = { id: string; name: string };

type Announcement = {
  id: string;
  title: string;
  titleArabic: string | null;
  content: string;
  contentArabic: string | null;
  target: string;
  targetId: string | null;
  isPublished: boolean;
};

export function EditAnnouncementForm({
  announcement,
  programmes,
  levels,
  classes,
}: {
  announcement: Announcement;
  programmes: Item[];
  levels: Item[];
  classes: Item[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(announcement.title);
  const [titleArabic, setTitleArabic] = useState(announcement.titleArabic || "");
  const [content, setContent] = useState(announcement.content);
  const [contentArabic, setContentArabic] = useState(announcement.contentArabic || "");
  const [target, setTarget] = useState(announcement.target);
  const [targetId, setTargetId] = useState(announcement.targetId || "");
  const [isPublished, setIsPublished] = useState(announcement.isPublished);

  const needsTargetId = ["programme", "level", "class"].includes(target);
  const targetOptions =
    target === "programme" ? programmes : target === "level" ? levels : target === "class" ? classes : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/announcements/${announcement.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          titleArabic: titleArabic || null,
          content,
          contentArabic: contentArabic || null,
          target,
          targetId: needsTargetId ? targetId : null,
          isPublished,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to update");
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

  async function handleDelete() {
    if (!confirm("Delete this announcement? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/announcements/${announcement.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to delete");
        setDeleting(false);
        return;
      }
      router.push("/admin/announcements");
      router.refresh();
    } catch {
      setError("Network error");
      setDeleting(false);
    }
  }

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
          <Label>Select {target} *</Label>
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
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="publish"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="publish" style={{ color: "hsl(0, 0%, 8%)", fontWeight: 500 }}>
          Published (visible to targeted users)
        </label>
      </div>

      <div className="flex flex-wrap gap-3 pt-4 border-t" style={{ borderColor: "hsl(35, 20%, 88%)" }}>
        <button
          type="submit"
          disabled={loading || deleting}
          className="px-5 py-3 rounded-md"
          style={{
            background: "hsl(0, 0%, 8%)",
            color: "white",
            fontWeight: 600,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/announcements")}
          className="px-5 py-3 rounded-md"
          style={{
            border: "1.5px solid hsl(0, 0%, 8%)",
            color: "hsl(0, 0%, 8%)",
            fontWeight: 600,
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading || deleting}
          className="px-5 py-3 rounded-md ml-auto"
          style={{
            background: "hsl(0, 60%, 42%)",
            color: "white",
            fontWeight: 600,
            opacity: deleting ? 0.6 : 1,
          }}
        >
          {deleting ? "Deleting..." : "Delete"}
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