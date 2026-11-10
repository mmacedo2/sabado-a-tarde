import { Link } from "@tanstack/react-router";

import { competitionKindLabel, type Competition } from "@/lib/api";

/** Competition cards for dark (bg-ink) sections. */
export function CompetitionCards({ competitions }: { competitions: Competition[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {competitions.map((c) => (
        <Link
          key={c.slug}
          to="/$competition"
          params={{ competition: c.slug }}
          className="group flex flex-col rounded-xl border border-ink-border bg-white/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-white/[0.06]"
        >
          {c.logoUrl && (
            <img
              src={c.logoUrl}
              alt={`Símbolo da ${c.name}`}
              loading="lazy"
              width={1024}
              height={768}
              className="h-24 w-auto self-start object-contain brightness-0 invert transition-transform group-hover:scale-105"
            />
          )}
          <p className="eyebrow mt-6 text-primary">{competitionKindLabel[c.kind]}</p>
          <h3 className="mt-1 font-display text-xl font-extrabold uppercase">{c.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{c.tagline}</p>
        </Link>
      ))}
    </div>
  );
}
