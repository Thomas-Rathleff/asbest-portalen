import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug mangler" }, { status: 400 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Mangler env vars" }, { status: 500 });
  }

  const res = await fetch(`${url}/rest/v1/virksomheder?asbe_nr=eq.${encodeURIComponent(slug.toUpperCase())}&select=*`,
    {
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "DB fejl" }, { status: 502 });
  }

  const data = await res.json();
  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Ikke fundet" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}
