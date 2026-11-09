import { describe, expect, it } from "vitest";

import { adminClient, Client } from "./helpers";

type Settings = { logoUrl: string | null };

const catalogSettings = async () =>
  ((await (await new Client().request("/api/catalog")).json()) as { settings: Settings }).settings;

describe("site logo", () => {
  it("is set by an admin, published in the catalog and reset with an empty value", async () => {
    const admin = await adminClient();
    const saved = await admin.request("/api/admin/settings", {
      method: "PATCH",
      json: { logoUrl: "/api/media/uploads/logo.png" },
    });
    expect(saved.status).toBe(200);
    expect(((await saved.json()) as Settings).logoUrl).toBe("/api/media/uploads/logo.png");
    expect((await catalogSettings()).logoUrl).toBe("/api/media/uploads/logo.png");

    await admin.request("/api/admin/settings", { method: "PATCH", json: { logoUrl: "" } });
    expect((await catalogSettings()).logoUrl).toBeNull();
  });

  it("rejects unsafe addresses and unknown settings", async () => {
    const admin = await adminClient();
    for (const json of [
      { logoUrl: "javascript:alert(1)" },
      { logoUrl: "//evil.example/x.png" },
      { other: "x" },
    ]) {
      const res = await admin.request("/api/admin/settings", { method: "PATCH", json });
      expect(res.status).toBe(400);
    }
  });

  it("can only be changed by admins", async () => {
    for (const role of ["manager", "user"] as const) {
      const client = await adminClient(undefined, role);
      const res = await client.request("/api/admin/settings", {
        method: "PATCH",
        json: { logoUrl: "/api/media/uploads/logo.png" },
      });
      expect(res.status).toBe(403);
    }
  });
});
