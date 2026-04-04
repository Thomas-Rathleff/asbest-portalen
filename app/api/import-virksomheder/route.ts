import { NextRequest, NextResponse } from "next/server";
import virksomheder from "../../../public/data/virksomheder.json";

// Engangsbrug — slet denne route efter import er færdig
// Kald: GET /api/import-virksomheder?secret=asbest2026

interface Virksomhed {
  navn: string;
  adresse: string;
  postnr: string;
  by: string;
  cvr: string;
  asbe_nr: string | null;
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "asbest2026") {
    return NextResponse.json({ error: "Uautoriseret" }, { status: 401 });
  }

  // Brug env vars med begge mulige navne
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://twioszuznfupiqgpwepy.supabase.co";
  const key = process.env.SUPABASE_SERVICE_KEY || process.env["SUPABASE_SERVICE_N\u00d8GLEN"] || "";

  if (!url || !key) {
    return NextResponse.json({ error: "Mangler Supabase env vars", url: !!url, key: !!key }, { status: 500 });
  }

  const liste = (virksomheder as Virksomhed[]).filter(v => v.asbe_nr);
  const batch_size = 100;
  let total = 0;
  const errors: string[] = [];

  for (let i = 0; i < liste.length; i += batch_size) {
    const batch = liste.slice(i, i + batch_size).map(v => ({
      asbe_nr: v.asbe_nr,
      navn: v.navn || null,
      adresse: v.adresse || null,
      postnr: v.postnr || null,
      by: v.by || null,
      cvr: v.cvr || null,
    }));

    try {
      const res = await fetch(`${url}/rest/v1/virksomheder`, {
        method: "POST",
        headers: {
          "apikey": key,
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates",
        },
        body: JSON.stringify(batch),
      });
      if (res.ok) {
        total += batch.length;
      } else {
        const txt = await res.text();
        errors.push(`Batch ${i}: ${res.status} ${txt.slice(0, 100)}`);
      }
    } catch (e: unknown) {
      errors.push(`Batch ${i}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return NextResponse.json({
    success: true,
    importeret: total,
    fejl: errors,
    total: liste.length,
    env_url: url.slice(0, 30),
  });
}
