import { useCallback, useEffect, useRef, useState } from "react";
import { Facebook, Check, Loader2, Unlink, ImageOff } from "lucide-react";
import { api } from "../../lib/api";
import Modal from "./Modal";

type Photo = { id: string; full: string; thumb: string; caption: string };
type Status = { configured: boolean; connected: boolean; pageName: string | null };

/**
 * Sélecteur de photos depuis la page Facebook (API Graph officielle).
 * Affiche l'état de connexion, permet de se connecter (OAuth en popup), de
 * parcourir les photos de la page et d'importer la sélection vers Cloudflare R2.
 */
export default function FacebookPicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (urls: string[]) => void;
}) {
  const [status, setStatus] = useState<Status | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [next, setNext] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const popupRef = useRef<Window | null>(null);

  const loadStatus = useCallback(async () => {
    setError("");
    try {
      const res = await api.get<Status>("/api/facebook/status");
      setStatus(res.data);
      return res.data;
    } catch {
      setError("Impossible de vérifier l'état de la connexion.");
      return null;
    }
  }, []);

  const loadPhotos = useCallback(async (after?: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<{ photos: Photo[]; next: string | null }>("/api/facebook/photos", {
        params: after ? { after } : {},
      });
      setPhotos((prev) => (after ? [...prev, ...res.data.photos] : res.data.photos));
      setNext(res.data.next);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Impossible de charger les photos.");
    } finally {
      setLoading(false);
    }
  }, []);

  // À l'ouverture : on récupère l'état, et les photos si déjà connecté.
  useEffect(() => {
    if (!open) return;
    setPhotos([]);
    setSelected(new Set());
    setNext(null);
    loadStatus().then((s) => {
      if (s?.connected) loadPhotos();
    });
  }, [open, loadStatus, loadPhotos]);

  // Écoute le retour de la popup OAuth.
  useEffect(() => {
    if (!open) return;
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "fb-auth") {
        if (e.data.ok)
          loadStatus().then((s) => {
            if (s?.connected) loadPhotos();
          });
        else setError("Connexion Facebook annulée ou échouée.");
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open, loadStatus, loadPhotos]);

  async function connect() {
    setError("");
    try {
      const res = await api.get<{ url: string }>("/api/facebook/login-url");
      popupRef.current = window.open(res.data.url, "fb-oauth", "width=600,height=720");
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Connexion impossible.");
    }
  }

  async function disconnect() {
    await api.post("/api/facebook/disconnect");
    setPhotos([]);
    setSelected(new Set());
    loadStatus();
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function importSelected() {
    const urls = photos.filter((p) => selected.has(p.id)).map((p) => p.full);
    if (!urls.length) return;
    setImporting(true);
    setError("");
    try {
      const res = await api.post<{ urls: string[]; errors?: { error: string }[] }>(
        "/api/upload/from-url",
        { urls }
      );
      if (res.data.urls?.length) onPick(res.data.urls);
      const errs = res.data.errors ?? [];
      if (errs.length) setError(`${errs.length} photo(s) non importée(s).`);
      else onClose();
    } catch {
      setError("Échec de l'import.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Importer depuis Facebook" wide>
      {!status ? (
        <div className="flex items-center justify-center py-10 text-ink/50">
          <Loader2 className="animate-spin" />
        </div>
      ) : !status.configured ? (
        <div className="rounded-xl bg-sand-50 p-5 text-sm text-ink/70">
          <p className="font-semibold text-ink">Facebook n'est pas encore configuré.</p>
          <p className="mt-2">
            Rends-toi dans l'onglet <strong>« Facebook »</strong> de l'administration pour renseigner
            les identifiants de l'app et connecter ta page (un tutoriel pas-à-pas t'y guide).
          </p>
        </div>
      ) : !status.connected ? (
        <div className="py-6 text-center">
          <Facebook className="mx-auto text-[#1877F2]" size={40} />
          <p className="mx-auto mt-3 max-w-sm text-sm text-ink/60">
            Connecte ta page Facebook pour parcourir ses photos et les importer. Tu te connectes
            directement chez Facebook — aucun mot de passe n'est stocké ici.
          </p>
          <button onClick={connect} className="btn-primary mx-auto mt-5">
            <Facebook size={16} /> Connecter Facebook
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-ink/60">
              Page connectée : <strong className="text-ink">{status.pageName}</strong>
            </p>
            <button
              onClick={disconnect}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink/50 hover:text-red-600"
            >
              <Unlink size={14} /> Déconnecter
            </button>
          </div>

          {photos.length === 0 && !loading ? (
            <div className="flex flex-col items-center gap-2 py-10 text-ink/40">
              <ImageOff /> <span className="text-sm">Aucune photo trouvée sur cette page.</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {photos.map((p) => {
                const on = selected.has(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle(p.id)}
                    className={`group relative aspect-square overflow-hidden rounded-lg ring-2 transition ${
                      on ? "ring-clay-600" : "ring-transparent hover:ring-clay-300"
                    }`}
                  >
                    <img src={p.thumb} alt={p.caption} className="h-full w-full object-cover" />
                    <span
                      className={`absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full transition ${
                        on ? "bg-clay-600 text-white" : "bg-white/70 text-transparent"
                      }`}
                    >
                      <Check size={13} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-4 text-ink/40">
              <Loader2 className="animate-spin" />
            </div>
          )}

          {next && !loading && (
            <button
              onClick={() => loadPhotos(next)}
              className="btn-outline mx-auto mt-4 !py-2 text-xs"
            >
              Charger plus
            </button>
          )}

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
            <span className="text-sm text-ink/50">{selected.size} sélectionnée(s)</span>
            <button
              onClick={importSelected}
              disabled={importing || selected.size === 0}
              className="btn-primary"
            >
              {importing ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Importer la sélection
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </Modal>
  );
}
