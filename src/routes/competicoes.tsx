import { createFileRoute } from "@tanstack/react-router";

import { CompetitionCards } from "@/components/site/CompetitionCards";
import { PageHeader } from "@/components/site/PageHeader";
import { useCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/competicoes")({
  head: () => ({
    meta: [
      { title: "Competições — Sábado à Tarde" },
      {
        name: "description",
        content:
          "Todas as competições do futebol popular de Guimarães: Super Liga, taças e prémios da época.",
      },
      { property: "og:title", content: "Competições — Sábado à Tarde" },
      {
        property: "og:description",
        content: "Super Liga, taças e prémios do futebol popular de Guimarães.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/competicoes" },
    ],
    links: [{ rel: "canonical", href: "/competicoes" }],
  }),
  component: CompetitionsPage,
});

function CompetitionsPage() {
  const { season, competitions } = useCatalog();
  return (
    <>
      <PageHeader
        eyebrow={season ? `Época ${season.name}` : "O que se joga ao sábado"}
        title="Competições"
        description="A liga, as taças e os prémios da época. Escolha uma competição para ver jogos, resultados e classificação."
      />
      <section className="bg-ink py-12 text-ink-foreground md:py-16">
        <div className="container-afpg">
          <CompetitionCards competitions={competitions} />
        </div>
      </section>
    </>
  );
}
