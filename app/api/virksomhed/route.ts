import { NextRequest, NextResponse } from "next/server";
import virksomheder from "../../../public/data/virksomheder.json";

interface Virksomhed {
  navn: string;
  adresse: string;
  postnr: string;
  by: string;
  cvr: string;
  asbe_nr: string | null;
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug mangler" }, { status: 400 });

  const v = (virksomheder as Virksomhed[]).find(
    (v) => v.asbe_nr?.toLowerCase().replace(/[^a-z0-9]/g, "-") === slug
  );

  if (!v) return NextResponse.json({ error: "Ikke fundet" }, { status: 404 });
  return NextResponse.json(v);
}
