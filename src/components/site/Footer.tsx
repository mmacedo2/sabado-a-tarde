import { Link } from "@tanstack/react-router";

import { useCatalog } from "@/lib/catalog";

export function Footer() {
  const { logo, competitions, season } = useCatalog();
  return (
    <footer className="mt-24 border-t border-ink-border bg-ink text-ink-foreground">
      <div className="container-afpg grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Sábado à Tarde"
              loading="lazy"
              width={1024}
              height={1024}
              className="size-12 object-contain"
            />
            <p className="font-display text-lg font-extrabold leading-tight">
              Sábado à Tarde
              <br />
              <span className="text-sm font-semibold text-ink-muted">
                Futebol Popular de Guimarães
              </span>
            </p>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
            Plataforma independente e anónima dos adeptos do futebol popular de Guimarães. Sem
            ligação oficial à AFPG.{season && ` Época ${season.name}.`}
          </p>
        </div>

        <div>
          <p className="eyebrow text-primary">Competições</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-muted">
            {competitions.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/$competition"
                  params={{ competition: c.slug }}
                  className="transition-colors hover:text-ink-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-primary">Associação (AFPG)</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-muted">
            <li>
              <Link to="/documentos" className="hover:text-ink-foreground">
                Documentos oficiais
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-border">
        <div className="container-afpg flex flex-wrap items-center justify-between gap-2 py-6 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} Sábado à Tarde — Futebol Popular de Guimarães</p>
          <p>
            Dados públicos baseados nos documentos oficiais da AFPG ·{" "}
            <Link to="/entrar" className="hover:text-ink-foreground">
              Área reservada
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
