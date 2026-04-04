"use client";
import { useState } from "react";

interface Virksomhed {
  navn: string;
  by: string;
  postnr: string;
  asbe_nr: string | null;
  afstand_km?: number;
}

export default function FindVirksomhed({ postnr }: { postnr: string }) {
  const [virksomheder, setVirksomheder] = useState<Virksomhed[]>([]);
  const [loading, setLoading] = useState(false);
  const [vist, setVist] = useState(false);

  async function hentVirksomheder() {
    setLoading(true);
    try {
      const res = await fetch(`/api/find-virksomheder?postnr=${postnr}`);
      const data = await res.json();
      setVirksomheder(data.virksomheder ?? []);
      setVist(true);
    } catch {
      setVist(true);
    }
    setLoading(false);
  }

  if (!vist) {
    return (
      <div className="mt-6 text-center">
        <button
          onClick={hentVirksomheder}
          disabled={loading}
          className="bg-[#1a365d] hover:bg-[#2a4a7f] text-white font-bold py-3 px-8 rounded-xl transition shadow-lg disabled:opacity-50"
        >
          {loading ? "⏳ Finder virksomheder..." : "🔍 Find autoriserede virksomheder nær dig"}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="font-bold text-gray-800 mb-3">
        Autoriserede asbestvirksomheder nær dig
      </h4>
      <div className="space-y-3">
        {virksomheder.map((v, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between shadow-sm"
          >
            <div>
              <div className="font-semibold text-gray-900">{v.navn}</div>
              <div className="text-sm text-gray-500">
                {v.postnr} {v.by}
                {v.afstand_km !== undefined && v.afstand_km < 9999 && (
                  <span className="ml-2 text-[#e67e22]">~{v.afstand_km} km væk</span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Auth: {v.asbe_nr}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-2">Kontaktinfo</div>
              <button className="bg-[#e67e22] hover:bg-[#f39c12] text-white text-sm font-semibold py-1.5 px-4 rounded-lg transition">
                Få tilbud →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upsell — fuld adgang kræver abonnement */}
      <div className="mt-4 bg-[#1a365d] rounded-xl p-4 text-white text-center">
        <div className="text-sm font-semibold mb-1">
          🔒 {virksomheder.length} af 1.159 virksomheder vist
        </div>
        <div className="text-xs text-blue-200 mb-3">
          Er du asbestvirksomhed? Få din profil vist og modtag leads direkte.
        </div>
        <button className="bg-[#e67e22] hover:bg-[#f39c12] text-white text-sm font-bold py-2 px-6 rounded-lg transition">
          Tilmeld din virksomhed →
        </button>
      </div>
    </div>
  );
}
