import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../../lib/auth";
import Logo from "../../components/Logo";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      await login(String(form.get("email")), String(form.get("password")));
      navigate("/admin");
    } catch {
      setError("Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink bg-grit p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-card sm:p-10">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-center text-2xl font-extrabold text-ink">Espace administration</h1>
        <p className="mt-1 text-center text-sm text-ink/50">
          Connectez-vous pour gérer le site.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink/70">Email</label>
            <input name="email" type="email" required className="field" placeholder="admin@2fgeneral.fr" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-ink/70">Mot de passe</label>
            <input name="password" type="password" required className="field" placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Connexion…" : "Se connecter"} <LogIn size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
