import { useEffect, useState } from "react";
import { api } from "./api";
import type { Settings } from "./types";

let cache: Settings | null = null;

const FALLBACK: Settings = {
  company_name: "Sarl 2F Général",
  tagline: "L'art de bâtir, la passion du détail",
  email: "contact@2fgeneral.fr",
  phone: "06 00 00 00 00",
  address: "Marignane, Bouches-du-Rhône (13)",
};

/** Charge (et met en cache) les réglages publics du site. */
export function useSettings() {
  const [settings, setSettings] = useState<Settings>(cache ?? FALLBACK);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    api
      .get<Settings>("/api/settings")
      .then((res) => {
        cache = { ...FALLBACK, ...res.data };
        setSettings(cache);
      })
      .catch(() => setSettings(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
