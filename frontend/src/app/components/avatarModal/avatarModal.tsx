"use client";

import { useState, ChangeEvent, FC } from "react";
import { apiFetch } from "@/lib/api";

interface Props {
  userId: string;
  defaultAvatar: string;
  onClose: () => void;
  onUpload: (newKey: string) => void;
}

export const AvatarModal: FC<Props> = ({
  userId,
  defaultAvatar,
  onClose,
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(defaultAvatar);
  const [saving, setSaving] = useState(false);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!file) return;
    try {
      setSaving(true);

      // 1) get presigned URL — apiFetch already returns JSON
      const { url, key } = await apiFetch("/images/presign", {
        method: "POST",
        body: JSON.stringify({ filename: file.name }),
      });

      // 2) upload to MinIO
      await fetch(url, { method: "PUT", body: file });

      // 3) update user record
      await apiFetch(`/user/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ avatar_url: key }),
      });

      onUpload(key);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Change Profile Picture</h2>
        <div className="flex flex-col items-center gap-4 mb-4">
          <img
            src={
              preview.startsWith("http")
                ? preview
                : `/api/images/${preview}`
            }
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="block"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!file || saving}
            className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
