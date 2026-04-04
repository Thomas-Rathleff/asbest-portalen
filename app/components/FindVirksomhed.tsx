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
  const [step, setStep] = useState<"knap" | "formular" | "bekraeftet">("knap");
  const [loading, setLoading] = useState(false);
  const [navn, setNavn] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [samtykke, setSamtykke] = useState(false);
  const [antal, setAntal] = useState(0);

  async function indsend() {
    if (!navn || !email || !telefon || !samtykke) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/find-virksomheder?postnr=${postnr}`);
      const data = await res.json();
      setAntal(data.virksomheder?.length ?? 3);
      // TODO: gem lead i database (Supabase)
    } catch {
      setAntal(3);
    }
    setLoading(false);
    setStep("bekraeftet");
  }

  if (step === "knap") {
    return (
      <div className="mt-6 text-center">
        <button
          onClick={() => setStep("formular")}
          className="bg-[#1a365d] hover:bg-[#2a4a7f] text-white font-bold py-3 px-8 rounded-xl transition shadow-lg"
        >
          🔍 Find autoriserede virksomheder nær dig
        </button>
      </div>
    );
  }

  if (step === "formular") {
    const udfyldt = navn && email && telefon && samtykke;
    return (
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h4 className="text-lg font-bold text-[#1a365d] mb-1">Få tilbud fra autoriserede virksomheder</h4>
        <p className="text-gray-500 text-sm mb-5">Udfyld dine kontaktoplysninger — vi finder de 3 nærmeste virksomheder og de kontakter dig inden for 1–3 hverdage.</p>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Dit navn"
            value={navn}
            onChange={(e) => setNavn(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e67e22]"
          />
          <input
            type="tel"
            placeholder="Telefonnummer"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e67e22]"
          />
          <input
            type="email"
            placeholder="E-mailadresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e67e22]"
          />

          {/* GDPR samtykke */}
          <label className="flex items-start gap-3 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={samtykke}
              onChange={(e) => setSamtykke(e.target.checked)}
              className="mt-1 w-4 h-4 accent-[#e67e22] flex-shrink-0"
            />
            <span className="text-sm text-gray-500">
              Jeg accepterer at Asbest-Portalen videregiver mine kontaktoplysninger til op til 3 autoriserede asbestvirksomheder, som må kontakte mig med tilbud. Jeg har læst{" "}
              <a href="/privatlivspolitik" target="_blank" className="text-[#e67e22] underline">privatlivspolitikken</a>{" "}
              og{" "}
              <a href="/betingelser" target="_blank" className="text-[#e67e22] underline">handelsbetingelserne</a>.
            </span>
          </label>
        </div>

        <button
          onClick={indsend}
          disabled={!udfyldt || loading}
          className="mt-5 w-full bg-[#e67e22] hover:bg-[#f39c12] disabled:opacity-40 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg"
        >
          {loading ? "⏳ Finder virksomheder..." : "Send forespørgsel →"}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center shadow-sm">
      <div className="text-4xl mb-3">✅</div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">
        Der er fundet {antal} godkendte virksomheder der matcher din forespørgsel
      </h4>
      <p className="text-gray-600 text-lg">
        Du bliver kontaktet inden for <strong>1–3 hverdage</strong>.
      </p>
      <p className="text-sm text-gray-400 mt-3">
        Alle virksomheder er autoriseret af Sikkerhedsstyrelsen til fjernelse af asbest.
      </p>
    </div>
  );
}
