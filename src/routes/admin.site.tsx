import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import defaultLogo from "@/assets/sabado-logo.png";
import { AdminSection, ImageField, useAdminMutation } from "@/components/admin/form";
import { Button } from "@/components/ui/button";
import { api, type SiteSettings } from "@/lib/api";
import { useCatalog } from "@/lib/catalog";

export const Route = createFileRoute("/admin/site")({ component: SiteSettingsPage });

function SiteSettingsPage() {
  const { settings } = useCatalog();
  const [logoUrl, setLogoUrl] = useState<string | null>(settings?.logoUrl ?? null);
  const save = useAdminMutation(
    (input: SiteSettings) => api.patch<SiteSettings>("/api/admin/settings", input),
    { success: "Aparência do site guardada.", public: true },
  );

  function submit(e: FormEvent) {
    e.preventDefault();
    save.mutate({ logoUrl: logoUrl ?? "" });
  }

  return (
    <AdminSection title="Aparência do site">
      <form onSubmit={submit} className="grid max-w-xl gap-6">
        <ImageField label="Logótipo" value={logoUrl} onChange={setLogoUrl} />
        <div>
          <p className="eyebrow mb-2 text-muted-foreground">Pré-visualização</p>
          <div className="flex items-center gap-3 rounded-lg bg-ink p-4 text-ink-foreground">
            <img src={logoUrl ?? defaultLogo} alt="" className="size-12 object-contain" />
            <span className="font-display text-base font-extrabold tracking-tight">
              Sábado à Tarde
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Aparece no cabeçalho e no rodapé. Deixe vazio para usar o logótipo original.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "A guardar…" : "Guardar"}
          </Button>
          {logoUrl && (
            <Button type="button" variant="outline" onClick={() => setLogoUrl(null)}>
              Repor original
            </Button>
          )}
        </div>
      </form>
    </AdminSection>
  );
}
