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
      {virksomheder.length > 0 ? (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="text-4xl mb-3">✅</div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            Der er fundet {virksomheder.length} godkendte virksomheder der matcher din forespørgsel
          </h4>
          <p className="text-gray-600 text-lg">
            Du bliver kontaktet af en virksomhed inden for <strong>1–3 hverdage</strong>.
          </p>
          <p className="text-sm text-gray-400 mt-3">
            Alle virksomheder er autoriseret af Sikkerhedsstyrelsen til fjernelse af asbest.
          </p>
        </div>
      ) : (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h4 className="text-lg font-bold text-gray-900 mb-2">Ingen virksomheder fundet i dit område</h4>
          <p className="text-gray-600">Prøv at kontakte os direkte — vi hjælper dig videre.</p>
        </div>
      )}
    </div>
  );
}
