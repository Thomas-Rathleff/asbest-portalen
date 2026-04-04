import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug mangler" }, { status: 400 });

  const url = "https://twioszuznfupiqgpwepy.supabase.co";
  const key = process.env.SUPABASE_SERVICE_KEY || "sb_publishable_4rBOIC7oTrSq044J79v2Jg_8iaZrXmZ";

  const asbeNr = slug.toUpperCase();

  const res = await fetch(`${url}/rest/v1/virksomheder?asbe_nr=eq.${encodeURIComponent(asbeNr)}&select=*`, {
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`,
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ error: "DB fejl", detail: txt }, { status: 502 });
  }

  const data = await res.json();
  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Ikke fundet", slug, asbeNr }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}
