"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  lat: number;
  lon: number;
  popupLabel: string;
};

export default function LuftfotoMap({ lat, lon, popupLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const map = L.map(el, {
      center: [lat, lon],
      zoom: 19,
      maxZoom: 19,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    L.control
      .zoom({
        position: "topright",
      })
      .addTo(map);

    // OpenStreetMap (gratis, ingen API-nøgle) — bruger standard tile-URL som anmodet
    const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    // Satellit: OSM tilbyder ikke satellitfliser; Esri World Imagery er gratis uden nøgle (typisk brugt med Leaflet)
    const satellit = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
      }
    );

    satellit.addTo(map);

    const baseMaps = {
      "Satellit": satellit,
      "Kort (OpenStreetMap)": osm,
    };
    L.control
      .layers(baseMaps, undefined, { collapsed: false, position: "topleft" })
      .addTo(map);

    const marker = L.marker([lat, lon], {
      icon: L.divIcon({
        className: "luftfoto-marker-wrap",
        html:
          '<div style="width:32px;height:32px;background:#dc2626;border:4px solid #fff;border-radius:50%;box-shadow:0 2px 10px rgba(0,0,0,0.45)"></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      }),
    }).addTo(map);
    marker.bindPopup(popupLabel);

    return () => {
      map.remove();
    };
  }, [lat, lon, popupLabel]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] rounded-b-xl z-0 [&_.leaflet-container]:font-sans [&_.leaflet-control-zoom]:border-2 [&_.leaflet-control-zoom]:border-white [&_.leaflet-control-zoom]:shadow-lg [&_.leaflet-control-zoom]:rounded-md [&_.leaflet-control-zoom_a]:text-lg [&_.leaflet-control-zoom_a]:leading-none [&_.leaflet-control-zoom_a]:min-w-[34px] [&_.leaflet-control-zoom_a]:py-1"
    />
  );
}
