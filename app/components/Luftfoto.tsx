"use client";
import { useEffect, useState } from "react";

interface Props {
  adresse: string;
  postnr: string;
  by: string;
  adgangsadresseid?: string;
}

export default function Luftfoto({ adresse, postnr, by, adgangsadresseid }: Props) {
  const [koordinater, setKoordinater] = useState<{ x: number; y: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hent koordinater via DAWA
    const query = adgangsadresseid
      ? `https://api.dataforsyningen.dk/adgangsadresser/${adgangsadresseid}`
      : `https://api.dataforsyningen.dk/adresser/autocomplete?q=${encodeURIComponent(`${adresse}, ${postnr} ${by}`)}&per_side=1`;

    fetch(query)
      .then(r => r.json())
      .then(data => {
        const item = adgangsadresseid ? data : data[0];
        if (item?.x || item?.adresse?.x) {
          setKoordinater({ x: item.x || item.adresse.x, y: item.y || item.adresse.y });
        } else if (item?.adgangspunkt?.koordinater) {
          setKoordinater({ x: item.adgangspunkt.koordinater[0], y: item.adgangspunkt.koordinater[1] });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [adresse, postnr, by, adgangsadresseid]);

  const luftfotoUrl = koordinater
    ? `https://api.dataforsyningen.dk/wms/orto_foraar?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=orto_foraar&STYLES=&CRS=EPSG:4326&BBOX=${koordinater.y - 0.0005},${koordinater.x - 0.0008},${koordinater.y + 0.0005},${koordinater.x + 0.0008}&WIDTH=600&HEIGHT=400&FORMAT=image/jpeg`
    : null;

  if (loading) return (
    <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
      <div className="text-gray-400 text-sm">Henter luftfoto...</div>
    </div>
  );

  if (!luftfotoUrl) return (
    <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
      <div className="text-gray-400 text-sm">Luftfoto ikke tilgængeligt</div>
    </div>
  );

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <div className="bg-[#1a365d] text-white text-sm font-semibold px-4 py-2 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        Luftfoto — {adresse}, {postnr} {by}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={luftfotoUrl}
        alt={`Luftfoto af ${adresse}`}
        className="w-full h-64 object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <div className="bg-gray-50 text-xs text-gray-400 px-3 py-1">
        © Styrelsen for Dataforsyning og Infrastruktur
      </div>
    </div>
  );
}
