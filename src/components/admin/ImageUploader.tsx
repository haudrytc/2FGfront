import { useRef, useState } from "react";
import { Upload, X, Loader2, Link2, FolderUp, Facebook } from "lucide-react";
import { api } from "../../lib/api";
import FacebookPicker from "./FacebookPicker";

/**
 * Upload une ou plusieurs images vers l'API et gère une liste d'URLs.
 * Sources : fichiers, dossier entier, glisser-déposer, ou import depuis une URL
 * (ex: photo Facebook publique — clic droit › « Copier l'adresse de l'image »).
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
  const folderRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [urlText, setUrlText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [fbOpen, setFbOpen] = useState(false);

  function reset() {
    if (inputRef.current) inputRef.current.value = "";
    if (folderRef.current) folderRef.current.value = "";
  }

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList) return;
    const images = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) {
      setError("Aucune image trouvée dans la sélection.");
      return;
    }
    setError("");
    setInfo("");
    setUploading(true);
    try {
      const added: string[] = [];
      // On envoie par lots de 40 (limite serveur)
      for (let i = 0; i < images.length; i += 40) {
        const fd = new FormData();
        images.slice(i, i + 40).forEach((f) => fd.append("files", f));
        const res = await api.post<{ urls: string[] }>("/api/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        added.push(...res.data.urls);
      }
      onChange(multiple ? [...value, ...added] : added.slice(0, 1));
      setInfo(`${added.length} image(s) importée(s).`);
    } catch {
      setError("Échec de l'upload. Vérifiez le format et la taille (max 12 Mo/image).");
    } finally {
      setUploading(false);
      reset();
    }
  }

  async function importFromUrls() {
    const urls = urlText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (urls.length === 0) return;
    setError("");
    setInfo("");
    setUploading(true);
    try {
      const res = await api.post<{ urls: string[]; errors?: { url: string; error: string }[] }>(
        "/api/upload/from-url",
        { urls }
      );
      const added = res.data.urls ?? [];
      if (added.length) onChange(multiple ? [...value, ...added] : added.slice(0, 1));
      const errs = res.data.errors ?? [];
      if (errs.length) setError(`${errs.length} lien(s) non importé(s) — ex: ${errs[0].error}`);
      if (added.length) setInfo(`${added.length} image(s) importée(s).`);
      if (added.length && !errs.length) {
        setUrlText("");
        setShowUrl(false);
      }
    } catch {
      setError("Import par URL échoué.");
    } finally {
      setUploading(false);
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-ink/70">{label}</label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          uploadFiles(e.dataTransfer.files);
        }}
        className={`flex flex-wrap gap-3 rounded-2xl p-1 transition ${
          dragOver ? "ring-2 ring-clay-500 ring-offset-2" : ""
        }`}
      >
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
          title="Choisir des fichiers (ou glisser-déposer ici)"
        >
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
        </button>
      </div>

      {/* Actions secondaires */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {multiple && (
          <button
            type="button"
            onClick={() => folderRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition hover:border-clay-500 hover:text-clay-700"
          >
            <FolderUp size={14} /> Importer un dossier
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          disabled={uploading}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            showUrl
              ? "border-clay-500 bg-clay-50 text-clay-700"
              : "border-ink/15 text-ink/70 hover:border-clay-500 hover:text-clay-700"
          }`}
        >
          <Link2 size={14} /> Importer depuis une URL
        </button>
        <button
          type="button"
          onClick={() => setFbOpen(true)}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition hover:border-[#1877F2] hover:text-[#1877F2]"
        >
          <Facebook size={14} /> Depuis Facebook
        </button>
        <span className="text-xs text-ink/40">Glisser-déposer accepté</span>
      </div>

      {showUrl && (
        <div className="mt-3 rounded-xl border border-ink/10 bg-sand-50 p-3">
          <p className="mb-2 text-xs text-ink/55">
            Colle une ou plusieurs adresses d'images (une par ligne). Depuis Facebook : ouvre une
            photo publique, <strong>clic droit › « Copier l'adresse de l'image »</strong>.
          </p>
          <textarea
            className="field resize-none font-mono text-xs"
            rows={3}
            placeholder="https://scontent.xx.fbcdn.net/…jpg&#10;https://…"
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
          />
          <button
            type="button"
            onClick={importFromUrls}
            disabled={uploading || !urlText.trim()}
            className="btn-primary mt-2 !px-4 !py-2 text-xs"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
            Importer les liens
          </button>
        </div>
      )}

      {/* inputs cachés */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => uploadFiles(e.target.files)}
      />
      <input
        ref={folderRef}
        type="file"
        className="hidden"
        multiple
        onChange={(e) => uploadFiles(e.target.files)}
        {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {info && !error && <p className="mt-2 text-sm text-green-600">{info}</p>}

      <FacebookPicker
        open={fbOpen}
        onClose={() => setFbOpen(false)}
        onPick={(urls) => {
          onChange(multiple ? [...value, ...urls] : urls.slice(0, 1));
          setInfo(`${urls.length} image(s) importée(s) depuis Facebook.`);
        }}
      />
    </div>
  );
}
