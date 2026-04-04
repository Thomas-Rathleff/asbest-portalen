import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import virksomheder from "../../../public/data/virksomheder.json";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

function postnrToCoords(postnr: string): { lat: number; lng: number } | null {
  const nr = parseInt(postnr);
  if (!nr) return null;
  if (nr >= 1000 && nr <= 2999) return { lat: 55.68, lng: 12.57 };
  if (nr >= 3000 && nr <= 3699) return { lat: 55.89, lng: 12.50 };
  if (nr >= 4000 && nr <= 4599) return { lat: 55.48, lng: 11.37 };
  if (nr >= 4600 && nr <= 4999) return { lat: 55.00, lng: 11.80 };
  if (nr >= 5000 && nr <= 5999) return { lat: 55.40, lng: 10.38 };
  if (nr >= 6000 && nr <= 6999) return { lat: 55.47, lng: 9.47 };
  if (nr >= 7000 && nr <= 7999) return { lat: 56.10, lng: 8.80 };
  if (nr >= 8000 && nr <= 8999) return { lat: 56.16, lng: 10.20 };
  if (nr >= 9000 && nr <= 9999) return { lat: 57.05, lng: 9.92 };
  return null;
}

function distance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { navn, telefon, email, adresse, postnr, byggeaar, tagmateriale, risiko } = body;

  if (!navn || !telefon || !postnr) {
    return NextResponse.json({ error: "Mangler påkrævede felter" }, { status: 400 });
  }

  // Find 3 nærmeste virksomheder
  const userCoords = postnrToCoords(postnr);
  const sorted = (virksomheder as any[])
    .map((v) => {
      const coords = postnrToCoords(v.postnr);
      const afstand_km = userCoords && coords
        ? Math.round(distance(userCoords.lat, userCoords.lng, coords.lat, coords.lng))
        : 9999;
      return { ...v, afstand_km };
    })
    .sort((a, b) => a.afstand_km - b.afstand_km)
    .slice(0, 5);

  // Gem lead i Supabase
  const { error } = await supabase.from("leads").insert({
    navn,
    telefon,
    email: email || null,
    adresse,
    postnr,
    byggeaar: byggeaar || null,
    tagmateriale: tagmateriale || null,
    risiko: risiko || null,
    matchede_virksomheder: sorted.map(v => v.asbe_nr).join(", "),
    status: "ny",
    oprettet_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Supabase fejl:", error);
    return NextResponse.json({ error: "Kunne ikke gemme forespørgsel" }, { status: 500 });
  }

  return NextResponse.json({ success: true, antal: sorted.length });
}
