// =====================================================================
//  Configuration SEO centrale — Sarl 2F Général (maçonnerie, Marignane)
//  ⚠️ Mets à jour SITE_URL avec le vrai domaine + le téléphone réel.
// =====================================================================

/** Domaine de production (sans slash final) — à remplacer par le vrai domaine. */
export const SITE_URL = "https://www.2fgeneral.fr";

/** Image de partage par défaut (réseaux sociaux / Google). */
export const OG_IMAGE = `${SITE_URL}/freres-2f.webp`;

/** Coordonnées de l'entreprise (NAP — Name, Address, Phone : doit rester cohérent partout). */
export const BUSINESS = {
  name: "Sarl 2F Général",
  legalName: "SARL 2F Général",
  description:
    "Entreprise de maçonnerie générale à Marignane : construction de maison, rénovation, extension, gros œuvre, façade, carrelage et construction de piscine dans les Bouches-du-Rhône.",
  phone: "+33600000000", // ← à remplacer par le numéro réel
  email: "contact@2fgeneral.fr",
  street: "3 boulevard Georges Clemenceau",
  postalCode: "13700",
  city: "Marignane",
  region: "Bouches-du-Rhône",
  country: "FR",
  latitude: 43.4158,
  longitude: 5.2156,
  priceRange: "€€",
  foundingYear: "2021",
  facebook: "https://www.facebook.com/p/Sarl-2F-G%C3%A9n%C3%A9ral-100065267689843/",
};

/** Villes desservies dans les Bouches-du-Rhône (référencement local). */
export const CITIES = [
  "Marignane",
  "Vitrolles",
  "Marseille",
  "Aix-en-Provence",
  "Martigues",
  "Istres",
  "Salon-de-Provence",
  "Châteauneuf-les-Martigues",
  "Gignac-la-Nerthe",
  "Saint-Victoret",
  "Les Pennes-Mirabeau",
  "Berre-l'Étang",
  "Rognac",
  "Saint-Mitre-les-Remparts",
  "Port-de-Bouc",
  "Fos-sur-Mer",
  "Sausset-les-Pins",
  "Carry-le-Rouet",
  "Ensuès-la-Redonne",
  "La Fare-les-Oliviers",
  "Velaux",
  "Cabriès",
  "Bouc-Bel-Air",
  "Allauch",
  "Plan-de-Cuques",
  "Gardanne",
  "Septèmes-les-Vallons",
];

/** Prestations principales (mots-clés métier). */
export const SERVICES = [
  "Maçonnerie générale",
  "Gros œuvre",
  "Construction de maison individuelle",
  "Rénovation & réhabilitation",
  "Extension & surélévation",
  "Construction de piscine",
  "Plâtrerie & peinture",
  "Carrelage & faïence",
  "Façade & ravalement",
  "Terrassement",
  "Dallage & terrasse",
  "Murets & clôtures",
];

/** Liste de mots-clés (peu pondérée par Google mais demandée). */
export const KEYWORDS = [
  "maçon",
  "maçonnerie",
  "maçonnerie générale",
  "entreprise de maçonnerie",
  "maçon Marignane",
  "maçonnerie Marignane",
  "construction maison",
  "constructeur maison",
  "rénovation",
  "rénovation maison",
  "extension maison",
  "gros œuvre",
  "construction piscine",
  "maçonnerie piscine",
  "terrasse",
  "dallage",
  "carrelage",
  "façade",
  "ravalement de façade",
  "enduit",
  "plâtrerie",
  "peinture",
  "muret",
  "clôture",
  "terrassement",
  "artisan maçon",
  "devis maçonnerie",
  "Bouches-du-Rhône",
  "Marignane",
  "Vitrolles",
  "Marseille",
  "étang de Berre",
].join(", ");

/** Construit une URL absolue à partir d'un chemin relatif. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Données structurées LocalBusiness / GeneralContractor (référencement local Google). */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description: BUSINESS.description,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: OG_IMAGE,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    foundingDate: BUSINESS.foundingYear,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      postalCode: BUSINESS.postalCode,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    areaServed: CITIES.map((c) => ({ "@type": "City", name: c })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    sameAs: [BUSINESS.facebook],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Prestations de maçonnerie",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s },
      })),
    },
  };
}
