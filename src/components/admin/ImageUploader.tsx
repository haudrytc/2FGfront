import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { api } from "../../lib/api";

/**
 * Upload une ou plusieurs images vers l'API et gère une liste d'URLs.
 * Utilisé pour la galerie d'une réalisation, la photo d'un membre, etc.
 */
export default function ImageUploader({
  value,
  onChange,
  multiple = true,
  label = "Photos",
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await api.post<{ urls: string[] }>("/api/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const next = multiple ? [...value, ...res.data.urls] : res.data.urls.slice(0, 1);
      onChange(next);
    } catch {
      setError("Échec de l'upload. Vérifiez le format et la taille (max 12 Mo).");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-ink/70">{label}</label>
      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-ink/10">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-white opacity-0 transition group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="grid h-24 w-24 place-items-center rounded-xl border-2 border-dashed border-ink/20 text-ink/40 transition hover:border-clay-500 hover:text-clay-600"
        >
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
