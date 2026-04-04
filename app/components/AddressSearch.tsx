"use client";
import { useState, useEffect, useRef } from "react";

interface AddressSuggestion {
  tekst: string;
  adresse: {
    id: string;
    vejnavn: string;
    husnr: string;
    postnr: string;
    postnrnavn: string;
    adgangsadresseid: string;
  };
}

interface AsbestResult {
  address: string;
  riskLevel: "high" | "medium" | "low" | "unknown";
  riskScore: number;
  buildYear: number | null;
  roofMaterial: string | null;
  area: number | null;
  details: string[];
}

export default function AddressSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AsbestResult | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [buildYear, setBuildYear] = useState("");
  const [roofType, setRoofType] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.dataforsyningen.dk/adresser/autocomplete?q=${encodeURIComponent(query)}&per_side=6`
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function selectAddress(suggestion: AddressSuggestion) {
    setQuery(suggestion.tekst);
    setSelectedAddress(suggestion.tekst);
    setShowSuggestions(false);
    setResult(null);
    setLoading(true);

    // Hent BBR data automatisk
    try {
      const res = await fetch(
        `/api/bbr-lookup?adgangsadresseid=${suggestion.adresse.adgangsadresseid}`
      );
      if (res.ok) {
        const bbr = await res.json();
        // Udfyld felter automatisk fra BBR
        if (bbr.byggeaar) setBuildYear(String(bbr.byggeaar));
        if (bbr.tagmateriale && bbr.tagmateriale !== "Ukendt") {
          // Map BBR tagmateriale til vores dropdown-værdier
          const tag = bbr.tagmateriale.toLowerCase();
          if (tag.includes("eternit") || tag.includes("fibercement")) setRoofType("eternit");
          else if (tag.includes("bølge")) setRoofType("bølgeplader");
          else if (tag.includes("tegl")) setRoofType("tegl");
          else if (tag.includes("tagpap")) setRoofType("tagpap");
          else if (tag.includes("metal") || tag.includes("stål")) setRoofType("metal");
          else setRoofType("andet");
        }
      }
    } catch {
      // BBR fejlede — vis manuelt formular
    }

    setLoading(false);
    setShowForm(true);
  }

  function analyzeAsbestos() {
    setLoading(true);
    const year = parseInt(buildYear);
    const details: string[] = [];
    let riskScore = 0;

    // Byggeår analyse
    if (year >= 1920 && year <= 1990) {
      riskScore += 50;
      details.push(`Bygget i ${year} — asbest blev brugt massivt i denne periode`);
    } else if (year > 1990) {
      details.push(`Bygget i ${year} — efter asbestforbuddet i 1986`);
    } else if (year < 1920 && year > 0) {
      riskScore += 10;
      details.push(`Bygget i ${year} — asbest var ikke udbredt endnu, men kan forekomme ved senere renovering`);
    }

    // Tagtype analyse
    const roof = roofType.toLowerCase();
    if (roof === "eternit" || roof === "fiber-cement") {
      riskScore += 40;
      details.push("Tagmateriale: Eternit/fibercement — høj sandsynlighed for asbest");
    } else if (roof === "bølgeplader") {
      riskScore += 35;
      details.push("Tagmateriale: Bølgeplader — sandsynligt asbestholdigt hvis fra før 1990");
    } else if (roof === "tegl") {
      riskScore += 5;
      details.push("Tagmateriale: Tegl — lav risiko for asbest i selve taget");
    } else if (roof === "tagpap") {
      riskScore += 10;
      details.push("Tagmateriale: Tagpap — kan indeholde asbest i underlag fra før 1990");
    } else if (roof === "metal" || roof === "stål") {
      details.push("Tagmateriale: Metal/stål — ingen asbest i selve taget");
    } else if (roof) {
      riskScore += 15;
      details.push(`Tagmateriale: ${roofType} — kræver nærmere undersøgelse`);
    }

    if (details.length === 0) {
      details.push("Utilstrækkelige data til vurdering — vi anbefaler en fysisk inspektion");
    }

    const riskLevel: AsbestResult["riskLevel"] =
      riskScore >= 60 ? "high" : riskScore >= 30 ? "medium" : riskScore > 0 ? "low" : "unknown";

    setTimeout(() => {
      setResult({
        address: selectedAddress,
        riskLevel,
        riskScore,
        buildYear: year || null,
        roofMaterial: roofType || null,
        area: null,
        details,
      });
      setLoading(false);
      setShowForm(false);
    }, 1500);
  }

  const riskConfig = {
    high: { color: "bg-red-500", text: "HØJ RISIKO", emoji: "🔴", bg: "bg-red-50", border: "border-red-200" },
    medium: { color: "bg-yellow-500", text: "MIDDEL RISIKO", emoji: "🟡", bg: "bg-yellow-50", border: "border-yellow-200" },
    low: { color: "bg-green-500", text: "LAV RISIKO", emoji: "🟢", bg: "bg-green-50", border: "border-green-200" },
    unknown: { color: "bg-gray-500", text: "UKENDT", emoji: "⚪", bg: "bg-gray-50", border: "border-gray-200" },
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Søgefelt */}
      <div ref={wrapperRef} className="relative">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Indtast din adresse, f.eks. Vestergade 12, 5000 Odense"
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#e67e22]/30 shadow-lg"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => selectAddress(s)}
                    className="w-full text-left px-4 py-3 text-gray-800 hover:bg-[#e67e22]/10 transition text-base border-b border-gray-50 last:border-0"
                  >
                    📍 {s.tekst}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Byggeår + tagtype formular */}
      {showForm && (
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-white font-bold text-lg mb-4">📋 Fortæl os om din bolig</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-blue-200 text-sm font-medium block mb-1">Byggeår</label>
              <input
                type="number"
                value={buildYear}
                onChange={(e) => setBuildYear(e.target.value)}
                placeholder="F.eks. 1965"
                className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e67e22]"
              />
            </div>
            <div>
              <label className="text-blue-200 text-sm font-medium block mb-1">Tagmateriale</label>
              <select
                value={roofType}
                onChange={(e) => setRoofType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e67e22]"
              >
                <option value="">Vælg tagtype</option>
                <option value="eternit">Eternit / Fibercement</option>
                <option value="bølgeplader">Bølgeplader</option>
                <option value="tegl">Tegl (mursten)</option>
                <option value="tagpap">Tagpap</option>
                <option value="metal">Metal / Stål</option>
                <option value="skifer">Skifer</option>
                <option value="andet">Andet / Ved ikke</option>
              </select>
            </div>
          </div>
          <button
            onClick={analyzeAsbestos}
            disabled={loading || !buildYear}
            className="w-full bg-[#e67e22] hover:bg-[#f39c12] text-white font-bold py-4 px-8 rounded-xl text-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Analyserer..." : "🔍 Få din asbestvurdering"}
          </button>
        </div>
      )}

      {/* Resultat */}
      {result && (
        <div className={`mt-8 rounded-2xl p-8 border-2 ${riskConfig[result.riskLevel].bg} ${riskConfig[result.riskLevel].border} shadow-xl`}>
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{riskConfig[result.riskLevel].emoji}</div>
            <div className={`inline-block px-4 py-2 rounded-full text-white font-bold text-sm ${riskConfig[result.riskLevel].color}`}>
              {riskConfig[result.riskLevel].text}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mt-3">{result.address}</h3>
          </div>
          
          <div className="space-y-3 mb-6">
            {result.details.map((detail, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/80 rounded-lg p-3">
                <span className="text-lg">📌</span>
                <span className="text-gray-700">{detail}</span>
              </div>
            ))}
          </div>

          {result.riskLevel !== "low" && (
            <div className="bg-white rounded-xl p-6 text-center">
              <p className="text-gray-600 mb-4">Vi anbefaler en professionel vurdering af din bolig</p>
              <button className="bg-[#e67e22] hover:bg-[#f39c12] text-white font-bold py-3 px-8 rounded-xl transition shadow-lg">
                Få 3 gratis tilbud fra asbestvirksomheder →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
