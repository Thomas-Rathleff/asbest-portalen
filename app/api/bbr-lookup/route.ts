import { NextRequest, NextResponse } from "next/server";

/**
 * BBR Lookup API Route
 *
 * Flow:
 * 1. Modtag adgangsadresseid fra DAWA (allerede tilgængeligt i AddressSearch)
 * 2. Slå bygning op i BBR via Datafordeleren (BBRPublic)
 * 3. Returner byggeår, tagmateriale og areal
 *
 * Kræver env variabel: BBR_USERNAME og BBR_PASSWORD
 * (Oprettes på datafordeler.dk under IT-system → Servicebrugere)
 */

const BBR_BASE = "https://services.datafordeler.dk/BBR/BBRPublic/1/rest";

// Mapping af BBR tagkoder til læsbare navne
const TAGKODE_MAP: Record<string, string> = {
  "1": "Tagpap",
  "2": "Fibercement (eternit)",
  "3": "Cementsten",
  "4": "Teglsten",
  "5": "Metalplader",
  "6": "Stråtag",
  "7": "Fibercement (bølgeplader)",
  "10": "Glas",
  "11": "Grønt tag",
  "12": "Betontagsten",
  "20": "Andet",
  "90": "Ikke oplyst",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adgangsadresseid = searchParams.get("adgangsadresseid");

  if (!adgangsadresseid) {
    return NextResponse.json({ error: "adgangsadresseid mangler" }, { status: 400 });
  }

  const username = process.env.BBR_USERNAME;
  const password = process.env.BBR_PASSWORD;

  if (!username || !password) {
    return NextResponse.json({ error: "BBR credentials ikke konfigureret" }, { status: 500 });
  }

  try {
    // Hent bygninger tilknyttet adgangsadressen
    const bbrUrl = `${BBR_BASE}/bygning?AdresseIdentificerer=${adgangsadresseid}&format=json&username=${username}&password=${password}`;
    const res = await fetch(bbrUrl, { next: { revalidate: 86400 } }); // cache 24 timer

    if (!res.ok) {
      console.error("BBR API fejl:", res.status, await res.text());
      return NextResponse.json({ error: "BBR opslag fejlede", status: res.status }, { status: 502 });
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Ingen BBR data fundet for denne adresse" }, { status: 404 });
    }

    // Tag den første (primære) bygning
    const bygning = data[0];

    const result = {
      byggeaar: bygning.byg026Opførelsesår ?? null,
      tagkode: bygning.byg033Tagdækningsmateriale ?? null,
      tagmateriale: TAGKODE_MAP[String(bygning.byg033Tagdækningsmateriale)] ?? "Ukendt",
      bebyggetAreal: bygning.byg041BebyggetAreal ?? null,
      samletBygningsareal: bygning.byg038SamletBygningsareal ?? null,
      bygningStatus: bygning.byg054AntalEtager ?? null,
      koordinater: bygning.byg404Koordinat ?? null,
      bbr_id: bygning.id_lokalId ?? null,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("BBR fetch fejl:", err);
    return NextResponse.json({ error: "Serverfejl ved BBR opslag" }, { status: 500 });
  }
}
