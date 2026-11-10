import { Hono } from "hono";

import type { AppEnv } from "../../env";
import { audit } from "../../lib/audit";
import { body } from "../../lib/validate";
import { settingsSchema } from "../../schemas";

export const settingsRoutes = new Hono<AppEnv>();

/** Settings keyed by their API name, with the database key each one is stored under. */
const KEYS = { logoUrl: "logo_url" } as const;

export async function readSettings(db: D1Database) {
  const { results } = await db
    .prepare("SELECT key, value FROM site_settings")
    .all<{ key: string; value: string | null }>();
  const stored = new Map(results.map((r) => [r.key, r.value]));
  return Object.fromEntries(
    Object.entries(KEYS).map(([name, key]) => [name, stored.get(key) ?? null]),
  ) as Record<keyof typeof KEYS, string | null>;
}

settingsRoutes.get("/", async (c) => c.json(await readSettings(c.env.DB)));

settingsRoutes.patch("/", async (c) => {
  const input = await body(c, settingsSchema);
  const changes = Object.entries(input).filter(([, v]) => v !== undefined) as [
    keyof typeof KEYS,
    string | null,
  ][];
  if (changes.length > 0) {
    await c.env.DB.batch(
      changes.map(([name, value]) =>
        c.env.DB.prepare(
          `INSERT INTO site_settings (key, value) VALUES (?, ?)
             ON CONFLICT (key) DO UPDATE SET value = excluded.value,
               updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`,
        ).bind(KEYS[name], value),
      ),
    );
    await audit(c, "update", "settings", null, Object.fromEntries(changes));
  }
  return c.json(await readSettings(c.env.DB));
});
