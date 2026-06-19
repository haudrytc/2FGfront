import { useCallback, useEffect, useRef, useState } from "react";
import {
  Facebook,
  Save,
  CheckCircle2,
  Copy,
  Check,
  Unlink,
  Loader2,
  Link2,
  ExternalLink,
} from "lucide-react";
import { api } from "../../../lib/api";

type Config = {
  appId: string;
  redirectUri: string;
  suggestedRedirectUri: string;
  hasSecret: boolean;
  configured: boolean;
  connected: boolean;
  pageName: string | null;
};

export default function FacebookAdmin() {
  const [cfg, setCfg] = useState<Config | null>(null);
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<Window | null>(null);

  const load = useCallback(async () => {
    const res = await api.get<Config>("/api/facebook/config");
    setCfg(res.data);
    setAppId(res.data.appId);
    setRedirectUri(res.data.redirectUri || res.data.suggestedRedirectUri);
    setAppSecret("");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Retour de la popup OAuth
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.type === "fb-auth") {
        if (e.data.ok) load();
        else setError("Connexion Facebook annulée ou échouée.");
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [load]);

  async function save() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await api.put("/api/facebook/config", { appId, appSecret, redirectUri });
      await load();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

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
    load();
  }

  function copyRedirect() {
    navigator.clipboard?.writeText(redirectUri).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  if (!cfg) {
    return (
      <div className="flex items-center justify-center py-16 text-ink/40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Tutoriel */}
      <details className="group rounded-2xl bg-white p-6 shadow-soft" open={!cfg.configured}>
        <summary className="flex cursor-pointer list-none items-center justify-between">
          <span className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Facebook className="text-[#1877F2]" size={20} /> Comment connecter Facebook ?
          </span>
          <span className="text-xs font-semibold text-clay-600 group-open:hidden">Afficher</span>
        </summary>

        <p className="mt-3 rounded-lg bg-clay-50 p-3 text-xs text-clay-800">
          Meta change régulièrement son interface. L'ordre exact des écrans peut varier : suis
          l'<strong>objectif</strong> de chaque étape plutôt que le libellé au mot près.
        </p>
        <ol className="mt-4 space-y-4 text-sm text-ink/75">
          <li>
            <strong>1.</strong> Va sur{" "}
            <a
              href="https://developers.facebook.com/apps/creation/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-clay-700 hover:underline"
            >
              developers.facebook.com <ExternalLink size={12} />
            </a>{" "}
            (connecte-toi, accepte les conditions développeur si demandé) →{" "}
            <strong>Créer une app</strong>.
          </li>
          <li>
            <strong>2. Détails de l'app :</strong> donne un nom (ex. « Site 2F Général ») + ton email,
            puis <strong>Suivant</strong>.
          </li>
          <li>
            <strong>3. Cas d'usage :</strong> c'est l'écran qui a remplacé l'ancien « type
            Entreprise ». Choisis <strong>« Autre »</strong> (tout en bas de la liste) →{" "}
            <strong>Suivant</strong>.
          </li>
          <li>
            <strong>4. Type :</strong> choisis <strong>« Entreprise »</strong> → <strong>Suivant</strong>.
            (Un portefeuille Business peut être demandé : tu peux continuer sans, ou en créer un.)
            Puis <strong>Créer l'app</strong>.
          </li>
          <li>
            <strong>5. Ajouter la connexion :</strong> dans le tableau de bord, menu de gauche →{" "}
            <strong>Ajouter un produit</strong> → carte <strong>« Connexion Facebook »</strong> →{" "}
            <strong>Configurer</strong> → choisis la plateforme <strong>Web</strong>.
          </li>
          <li>
            <strong>6. URI de redirection :</strong> menu{" "}
            <strong>Connexion Facebook → Paramètres</strong>, colle ceci dans{" "}
            <strong>« URI de redirection OAuth valides »</strong> puis <strong>Enregistrer</strong> :
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-ink/10 bg-sand-50 p-2">
              <code className="flex-1 break-all text-xs text-ink/80">{redirectUri}</code>
              <button
                type="button"
                onClick={copyRedirect}
                className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-semibold text-clay-700 ring-1 ring-ink/10 hover:ring-clay-300"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copié" : "Copier"}
              </button>
            </div>
          </li>
          <li>
            <strong>7. Identifiants :</strong> menu <strong>Paramètres de l'app → Général</strong> :
            copie l'<strong>Identifiant de l'app</strong> et la <strong>Clé secrète</strong> (bouton
            « Afficher »), et colle-les dans le formulaire ci-dessous.
          </li>
          <li>
            <strong>8. Rôles :</strong> vérifie dans <strong>Rôles de l'app</strong> que ton compte
            est <strong>administrateur</strong> — et qu'il administre aussi la page Facebook 2F
            Général. En <strong>mode développement</strong>, aucune validation Meta n'est nécessaire
            pour ton usage.
          </li>
          <li>
            <strong>9.</strong> Enregistre les identifiants ci-dessous, puis clique{" "}
            <strong>« Connecter Facebook »</strong>.
          </li>
        </ol>
      </details>

      {/* Formulaire de config */}
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="font-display text-lg font-bold text-ink">Identifiants de l'application</h3>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink/70">Identifiant de l'app (App ID)</label>
          <input className="field" value={appId} onChange={(e) => setAppId(e.target.value)} placeholder="1234567890" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink/70">Clé secrète (App Secret)</label>
          <input
            type="password"
            className="field"
            value={appSecret}
            onChange={(e) => setAppSecret(e.target.value)}
            placeholder={cfg.hasSecret ? "•••••••• (déjà enregistrée — laisser vide pour conserver)" : "Coller la clé secrète"}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink/70">URI de redirection OAuth</label>
          <input className="field" value={redirectUri} onChange={(e) => setRedirectUri(e.target.value)} />
          <p className="mt-1 text-xs text-ink/45">
            Doit être identique à celle déclarée dans l'app Facebook.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <button onClick={save} disabled={saving || !appId} className="btn-primary">
            <Save size={16} /> {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-600">
              <CheckCircle2 size={16} /> Enregistré
            </span>
          )}
        </div>
      </div>

      {/* Connexion */}
      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <h3 className="font-display text-lg font-bold text-ink">Connexion à la page</h3>
        {!cfg.configured ? (
          <p className="mt-2 text-sm text-ink/55">
            Renseigne d'abord l'App ID et la clé secrète ci-dessus.
          </p>
        ) : cfg.connected ? (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-sm text-ink/70">
              <CheckCircle2 size={18} className="text-green-600" />
              Connecté à <strong className="text-ink">{cfg.pageName}</strong>
            </p>
            <button
              onClick={disconnect}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/50 hover:text-red-600"
            >
              <Unlink size={15} /> Déconnecter
            </button>
          </div>
        ) : (
          <div className="mt-3">
            <p className="mb-3 text-sm text-ink/55">
              Tu te connectes directement chez Facebook — aucun mot de passe n'est stocké ici.
            </p>
            <button onClick={connect} className="btn-primary">
              <Facebook size={16} /> Connecter Facebook
            </button>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <p className="mt-4 flex items-start gap-2 text-xs text-ink/45">
          <Link2 size={13} className="mt-0.5 shrink-0" />
          Une fois connecté, importe des photos via le bouton « Depuis Facebook » dans n'importe quel
          champ d'images (réalisations, équipe…).
        </p>
      </div>
    </div>
  );
}
