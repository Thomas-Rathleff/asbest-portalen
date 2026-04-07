"use client";
import { useEffect, useRef } from "react";

interface Props {
  lat: number;
  lng: number;
  adresse: string;
}

export default function LuftfotoMap({ lat, lng, adresse }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    import("leaflet").then((L) => {
      import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current!, {
        center: [lat, lng],
        zoom: 19,
        zoomControl: true,
      });

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "© Esri" }
      ).addTo(map);

      L.circleMarker([lat, lng], {
        radius: 10,
        color: "#e67e22",
        fillColor: "#e67e22",
        fillOpacity: 0.8,
      }).addTo(map);

      mapInstance.current = map;
    });

    return () => {
      if (mapInstance.current) {
        (mapInstance.current as { remove: () => void }).remove();
        mapInstance.current = null;
      }
    };
  }, [lat, lng]);

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <div className="bg-[#1a365d] text-white text-sm font-semibold px-4 py-2 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        </svg>
        Luftfoto — {adresse}
      </div>
      <div ref={mapRef} style={{ height: "350px", width: "100%" }} />
      <div className="bg-gray-50 text-xs text-gray-400 px-3 py-1">
        © Esri — Satellitbillede
      </div>
    </div>
  );
}
