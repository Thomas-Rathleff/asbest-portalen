import { NextRequest, NextResponse } from "next/server";
import virksomheder from "../../../public/data/virksomheder.json";

interface Virksomhed {
  navn: string;
  adresse: string;
  postnr: string;
  by: string;
  cvr: string;
  asbe_nr: string | null;
  lat?: number;
  lng?: number;
}

// Postnummer → koordinater (forenklet dansk postnummer-grid)
// Bruges til at beregne afstand uden GPS
function postnrToCoords(postnr: string): { lat: number; lng: number } | null {
  const nr = parseInt(postnr);
  if (!nr) return null;
  // Grov geografisk fordeling af danske postnumre
  if (nr >= 1000 && nr <= 2999) return { lat: 55.68, lng: 12.57 }; // København
  if (nr >= 3000 && nr <= 3699) return { lat: 55.89, lng: 12.50 }; // Nordsjælland
  if (nr >= 3700 && nr <= 3799) return { lat: 55.10, lng: 14.92 }; // Bornholm
  if (nr >= 4000 && nr <= 4299) return { lat: 55.48, lng: 11.77 }; // Roskilde/Køge
  if (nr >= 4300 && nr <= 4599) return { lat: 55.42, lng: 11.37 }; // Vestsjælland
  if (nr >= 4600 && nr <= 4799) return { lat: 55.23, lng: 11.77 }; // Sydsjælland
  if (nr >= 4800 && nr <= 4999) return { lat: 54.77, lng: 11.87 }; // Lolland-Falster
  if (nr >= 5000 && nr <= 5999) return { lat: 55.40, lng: 10.38 }; // Fyn
  if (nr >= 6000 && nr <= 6999) return { lat: 55.47, lng: 9.47 };  // Sønderjylland
  if (nr >= 7000 && nr <= 7499) return { lat: 55.72, lng: 9.12 };  // Vejle/Kolding
  if (nr >= 7500 && nr <= 7999) return { lat: 56.45, lng: 8.50 };  // Midtjylland
  if (nr >= 8000 && nr <= 8999) return { lat: 56.16, lng: 10.20 }; // Aarhus
  if (nr >= 9000 && nr <= 9999) return { lat: 57.05, lng: 9.92 };  // Nordjylland
  return null;
}

function distance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postnr = searchParams.get("postnr");

  if (!postnr) {
    return NextResponse.json({ error: "postnr mangler" }, { status: 400 });
  }

  const userCoords = postnrToCoords(postnr);

  const liste = virksomheder as Virksomhed[];

  let sorted: (Virksomhed & { afstand_km?: number })[];

  if (userCoords) {
    sorted = liste
      .map((v) => {
        const coords = postnrToCoords(v.postnr);
        const afstand_km = coords
          ? Math.round(distance(userCoords.lat, userCoords.lng, coords.lat, coords.lng))
          : 9999;
        return { ...v, afstand_km };
      })
      .sort((a, b) => (a.afstand_km ?? 9999) - (b.afstand_km ?? 9999));
  } else {
    sorted = liste;
  }

  // Returner kun 3 nærmeste — begrænset info (ikke CVR, ikke kontaktinfo)
  const result = sorted.slice(0, 5).map((v) => ({
    navn: v.navn,
    by: v.by,
    postnr: v.postnr,
    asbe_nr: v.asbe_nr,
    afstand_km: v.afstand_km,
    // CVR og kontaktinfo kræver abonnement — ikke inkluderet her
  }));

  return NextResponse.json({ virksomheder: result, total: liste.length });
}
