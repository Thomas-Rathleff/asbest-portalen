import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import virksomheder from "../../../public/data/virksomheder.json";

// Engangsbrug — slet denne route efter import er færdig
// Kald: GET /api/import-virksomheder?secret=asbest2026

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

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

    const { error } = await supabase
      .from("virksomheder")
      .upsert(batch, { onConflict: "asbe_nr" });

    if (error) {
      errors.push(`Batch ${i}: ${error.message}`);
    } else {
      total += batch.length;
    }
  }

  return NextResponse.json({
    success: true,
    importeret: total,
    fejl: errors,
    total: liste.length,
  });
}
