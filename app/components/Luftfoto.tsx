"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  adresse: string;
  postnr: string;
  by: string;
  adgangsadresseid?: string;
}

export default function Luftfoto({ adresse, postnr, by, adgangsadresseid }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);
  const [fejl, setFejl] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const query = adgangsadresseid
      ? `https://api.dataforsyningen.dk/adgangsadresser/${adgangsadresseid}`
      : `https://api.dataforsyningen.dk/adresser/autocomplete?q=${encodeURIComponent(`${adresse}, ${postnr} ${by}`)}&per_side=1`;

    fetch(query)
      .then(r => r.json())
      .then(data => {
        const item = adgangsadresseid ? data : data[0];
        let lat: number | null = null;
        let lng: number | null = null;

        if (item?.y && item?.x) { lat = item.y; lng = item.x; }
        else if (item?.adresse?.y) { lat = item.adresse.y; lng = item.adresse.x; }
        else if (item?.adgangspunkt?.koordinater) {
          lng = item.adgangspunkt.koordinater[0];
          lat = item.adgangspunkt.koordinater[1];
        }

        if (!lat || !lng) { setFejl(true); return; }

        import("leaflet").then((L) => {
          if (!mapRef.current || mapInstance.current) return;

          const map = L.map(mapRef.current, {
            center: [lat!, lng!],
            zoom: 19,
            zoomControl: true,
          });

          L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            { attribution: "© Esri" }
          ).addTo(map);

          L.circleMarker([lat!, lng!], {
            radius: 10,
            color: "#e67e22",
            fillColor: "#e67e22",
            fillOpacity: 0.9,
          }).bindPopup(adresse).addTo(map);

          mapInstance.current = map;
        });
      })
      .catch(() => setFejl(true));

    return () => {
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null;
      }
    };
  }, [adresse, postnr, by, adgangsadresseid]);

  if (fejl) return null;

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <div className="bg-[#1a365d] text-white text-sm font-semibold px-4 py-2 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        </svg>
        Luftfoto — {adresse}, {postnr} {by}
      </div>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height: "350px", width: "100%" }} />
      <div className="bg-gray-50 text-xs text-gray-400 px-3 py-1">
        © Esri — Satellitbillede af ejendommen
      </div>
    </div>
  );
}
