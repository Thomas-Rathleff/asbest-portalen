"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import proj4 from "proj4";

proj4.defs(
  "EPSG:25832",
  "+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
);

interface Props {
  adresse: string;
  postnr: string;
  by: string;
  adgangsadresseid?: string;
}

const LuftfotoMap = dynamic(() => import("./LuftfotoMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-100 rounded-b-xl flex items-center justify-center text-gray-400 text-sm">
      Indlæser kort…
    </div>
  ),
});

function extractEastingNorthing(item: Record<string, unknown> | undefined): { x: number; y: number } | null {
  if (!item) return null;
  const x = (item as { x?: number }).x ?? (item as { adresse?: { x?: number } }).adresse?.x;
  const y = (item as { y?: number }).y ?? (item as { adresse?: { y?: number } }).adresse?.y;
  if (typeof x === "number" && typeof y === "number" && Number.isFinite(x) && Number.isFinite(y)) {
    return { x, y };
  }
  const koord = (item as { adgangspunkt?: { koordinater?: number[] } }).adgangspunkt?.koordinater;
  if (koord && koord.length >= 2 && typeof koord[0] === "number" && typeof koord[1] === "number") {
    return { x: koord[0], y: koord[1] };
  }
  return null;
}

/** DAWA: typisk EPSG:25832 (meter). Konverter til WGS84 til Leaflet. */
function toLatLon(en: { x: number; y: number }): { lat: number; lon: number } | null {
  const { x, y } = en;

  // Allerede grader (Danmark: ca. lon 7–16, lat 54–58)
  if (x >= 5 && x <= 20 && y >= 54 && y <= 59) {
    return { lat: y, lon: x };
  }

  // EPSG:25832 (ETRS89 / UTM 32N) — typiske danske værdier
  if (x > 200_000 && x < 1_000_000 && y > 5_900_000 && y < 6_500_000) {
    const [lon, lat] = proj4("EPSG:25832", "EPSG:4326", [x, y]);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      return { lat, lon };
    }
  }

  return null;
}

export default function Luftfoto({ adresse, postnr, by, adgangsadresseid }: Props) {
  const [latLon, setLatLon] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = adgangsadresseid
      ? `https://api.dataforsyningen.dk/adgangsadresser/${adgangsadresseid}`
      : `https://api.dataforsyningen.dk/adresser/autocomplete?q=${encodeURIComponent(`${adresse}, ${postnr} ${by}`)}&per_side=1`;

    fetch(query)
      .then(r => r.json())
      .then(data => {
        const item = adgangsadresseid ? data : data[0];
        const en = extractEastingNorthing(item);
        const ll = en ? toLatLon(en) : null;
        setLatLon(ll);
        setLoading(false);
      })
      .catch(() => {
        setLatLon(null);
        setLoading(false);
      });
  }, [adresse, postnr, by, adgangsadresseid]);

  const popupLabel = `${adresse}, ${postnr} ${by}`.trim();

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-xl h-[400px] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Henter kort…</div>
      </div>
    );
  }

  if (!latLon) {
    return (
      <div className="bg-gray-100 rounded-xl h-[400px] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Kunne ikke finde koordinater for adressen</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <div className="bg-[#1a365d] text-white text-sm font-semibold px-4 py-2 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        Luftfoto — {adresse}, {postnr} {by}
      </div>
      <LuftfotoMap lat={latLon.lat} lon={latLon.lon} popupLabel={popupLabel} />
      <div className="bg-gray-50 text-xs text-gray-500 px-3 py-2 leading-relaxed">
        Interaktivt kort: skift mellem satellit og OpenStreetMap. © OpenStreetMap-bidragsydere / Esri (satellit).
      </div>
    </div>
  );
}
