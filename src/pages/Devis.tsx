import PageHeader from "../components/PageHeader";
import PriceSimulator from "../components/PriceSimulator";
import Seo from "../components/Seo";

/** Page dédiée au simulateur de devis (affichée quand placement = "page"). */
export default function Devis() {
  return (
    <div>
      <Seo
        title="Devis maçonnerie en ligne — Estimation gratuite"
        description="Estimez le budget de vos travaux de maçonnerie, construction, rénovation ou piscine avec le simulateur en ligne de la Sarl 2F Général. Estimation immédiate et gratuite, sans engagement."
        path="/devis"
      />
      <PageHeader
        title="Estimez votre projet"
        subtitle="Un ordre de prix immédiat pour vos travaux — gratuit et sans engagement."
      />
      <PriceSimulator force />
    </div>
  );
}
