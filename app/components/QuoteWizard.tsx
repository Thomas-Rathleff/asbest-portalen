"use client";
import { useState } from "react";

interface QuoteFormData {
  address: string;
  roofType: string;
  roofArea: number;
  stories: string;
  damaged: string;
  otherAsbestos: string;
  serviceType: string[];
  newRoofType: string;
  timeline: string;
  description: string;
  name: string;
  phone: string;
  email: string;
  contactTime: string;
}

const ROOF_TYPES = [
  {
    id: "boelgeeternit",
    name: "Bølgeeternit",
    desc: "Grå bølgede plader — mest almindelig",
    emoji: "〰️",
    color: "bg-gray-300",
    risk: "high",
  },
  {
    id: "skifer-eternit",
    name: "Skifer-eternit",
    desc: "Flade, mørke plader i skifermønster",
    emoji: "⬛",
    color: "bg-gray-600",
    risk: "high",
  },
  {
    id: "teglsten",
    name: "Teglsten",
    desc: "Røde eller brune tagsten i ler",
    emoji: "🧱",
    color: "bg-red-400",
    risk: "low",
  },
  {
    id: "tagpap",
    name: "Tagpap",
    desc: "Fladt, sort/mørkt — typisk fladt tag",
    emoji: "⬜",
    color: "bg-gray-800",
    risk: "medium",
  },
  {
    id: "betontagsten",
    name: "Betontagsten",
    desc: "Ligner tegl, men glattere og tungere",
    emoji: "🔲",
    color: "bg-gray-400",
    risk: "low",
  },
  {
    id: "staal",
    name: "Stål / Metal",
    desc: "Blank eller farvet metalplade",
    emoji: "✨",
    color: "bg-blue-300",
    risk: "none",
  },
  {
    id: "usikker",
    name: "Jeg er usikker",
    desc: "Upload et billede — vi hjælper dig",
    emoji: "❓",
    color: "bg-yellow-200",
    risk: "unknown",
  },
];

const NEW_ROOF_TYPES = [
  { id: "teglsten", name: "Teglsten (klassisk)", emoji: "🧱" },
  { id: "betontagsten", name: "Betontagsten", emoji: "🔲" },
  { id: "staalplader", name: "Stålplader", emoji: "✨" },
  { id: "tagpap", name: "Tagpap", emoji: "⬜" },
  { id: "solceller", name: "Soltag / Solceller", emoji: "☀️" },
  { id: "usikker", name: "Jeg er usikker", emoji: "🤔" },
];

function calculatePrice(roofType: string, area: number): { min: number; max: number; note: string } {
  const minArea = 50;
  const effectiveArea = Math.max(area, minArea);
  
  // Base pris pr. m²
  let pricePerM2Min = 400;
  let pricePerM2Max = 500;
  
  // Juster for tagtype
  if (roofType === "skifer-eternit") {
    pricePerM2Min = 450;
    pricePerM2Max = 600;
  } else if (roofType === "tagpap") {
    pricePerM2Min = 350;
    pricePerM2Max = 500;
  }
  
  // Opstartsomkostninger (KLS, miljøvogn, afhentning)
  const startupCost = 15000;
  
  let min = Math.round((effectiveArea * pricePerM2Min + startupCost) / 1000) * 1000;
  let max = Math.round((effectiveArea * pricePerM2Max + startupCost) / 1000) * 1000;
  
  let note = "";
  if (area < minArea) {
    note = `Minimumspris beregnet for ${minArea} m² pga. faste opstartsomkostninger (KLS-dokumentation, miljøvogn, affaldsafhentning m.m.)`;
  } else if (area > 300) {
    // Mængderabat ved store tage
    min = Math.round(min * 0.9 / 1000) * 1000;
    max = Math.round(max * 0.9 / 1000) * 1000;
    note = "Prisoverslag inkl. ca. 10% mængderabat for større tagflader";
  }
  
  return { min, max, note };
}

export default function QuoteWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<QuoteFormData>({
    address: "",
    roofType: "",
    roofArea: 100,
    stories: "",
    damaged: "",
    otherAsbestos: "",
    serviceType: [],
    newRoofType: "",
    timeline: "",
    description: "",
    name: "",
    phone: "",
    email: "",
    contactTime: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  function toggleService(service: string) {
    setForm((prev) => ({
      ...prev,
      serviceType: prev.serviceType.includes(service)
        ? prev.serviceType.filter((s) => s !== service)
        : [...prev.serviceType, service],
    }));
  }

  function handleSubmit() {
    // In production: send to API/database
    console.log("Quote submitted:", form);
    setSubmitted(true);
  }

  const price = form.roofType && form.roofArea
    ? calculatePrice(form.roofType, form.roofArea)
    : null;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-[#1a365d] mb-4">Din forespørgsel er sendt!</h2>
          <p className="text-gray-500 text-lg mb-6">
            Vi matcher dig med op til 3 autoriserede asbestvirksomheder i dit område.
            Du hører fra dem inden for 1-2 hverdage.
          </p>
          
          {price && (
            <div className="bg-[#f8f9fa] rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-500 mb-2">Estimeret prisinterval for din opgave</p>
              <p className="text-3xl font-bold text-[#1a365d]">
                {price.min.toLocaleString("da-DK")} — {price.max.toLocaleString("da-DK")} kr.
              </p>
              <p className="text-sm text-gray-400 mt-2">Ekskl. moms. Den endelige pris afhænger af en konkret vurdering.</p>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-4 text-left">
            <h3 className="font-bold text-[#1a365d] mb-2">📋 Hvad sker der nu?</h3>
            <ol className="text-gray-600 text-sm space-y-1">
              <li>1. Virksomheder i dit område modtager din forespørgsel</li>
              <li>2. Op til 3 virksomheder kontakter dig med tilbud</li>
              <li>3. Du sammenligner og vælger det bedste tilbud</li>
              <li>4. Ingen forpligtelser — det er helt gratis</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Trin {step} af {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#e67e22] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        
        {/* ===== TRIN 1: Adresse ===== */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-2">📍 Hvor er ejendommen?</h2>
            <p className="text-gray-500 mb-6">Indtast adressen hvor asbestarbejdet skal udføres</p>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="F.eks. Vestergade 12, 5000 Odense"
              className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 text-lg focus:outline-none focus:border-[#e67e22] transition"
            />
          </div>
        )}

        {/* ===== TRIN 2: Tagtype ===== */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-2">🏠 Hvilken type tag har du?</h2>
            <p className="text-gray-500 mb-6">Klik på det billede der ligner dit tag mest</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {ROOF_TYPES.map((roof) => (
                <button
                  key={roof.id}
                  onClick={() => setForm({ ...form, roofType: roof.id })}
                  className={`relative rounded-xl p-4 border-2 transition-all text-center hover:shadow-lg ${
                    form.roofType === roof.id
                      ? "border-[#e67e22] bg-orange-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {form.roofType === roof.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#e67e22] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className={`w-full h-16 ${roof.color} rounded-lg mb-3 flex items-center justify-center text-3xl`}>
                    {roof.emoji}
                  </div>
                  <div className="font-bold text-sm text-[#1a365d]">{roof.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{roof.desc}</div>
                  {roof.risk === "high" && (
                    <div className="mt-2 text-xs bg-red-100 text-red-600 rounded-full px-2 py-0.5 inline-block">🔴 Høj asbestrisiko</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ===== TRIN 3: Detaljer ===== */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-2">📐 Fortæl om taget</h2>
            <p className="text-gray-500 mb-6">Jo mere præcist, jo bedre prisestimat</p>
            
            {/* Tagareal slider */}
            <div className="mb-6">
              <label className="block font-bold text-[#1a365d] mb-2">
                Tagareal: <span className="text-[#e67e22]">{form.roofArea} m²</span>
              </label>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={form.roofArea}
                onChange={(e) => setForm({ ...form, roofArea: parseInt(e.target.value) })}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#e67e22]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>20 m²</span>
                <span>250 m²</span>
                <span>500 m²</span>
              </div>
              {form.roofArea < 50 && (
                <div className="mt-2 text-sm text-amber-600 bg-amber-50 rounded-lg p-3">
                  ⚠️ Opgaver under 50 m² har højere m²-pris pga. faste opstartsomkostninger (KLS, miljøvogn, affaldsafhentning)
                </div>
              )}
            </div>

            {/* Etager */}
            <div className="mb-6">
              <label className="block font-bold text-[#1a365d] mb-2">Antal etager</label>
              <div className="grid grid-cols-4 gap-2">
                {["1", "1½", "2", "2+"].map((val) => (
                  <button
                    key={val}
                    onClick={() => setForm({ ...form, stories: val })}
                    className={`py-3 rounded-lg border-2 font-bold transition ${
                      form.stories === val
                        ? "border-[#e67e22] bg-orange-50 text-[#e67e22]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Beskadiget */}
            <div className="mb-6">
              <label className="block font-bold text-[#1a365d] mb-2">Er taget beskadiget?</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: "ja", label: "Ja", emoji: "⚠️" },
                  { val: "nej", label: "Nej", emoji: "✅" },
                  { val: "ved-ikke", label: "Ved ikke", emoji: "🤷" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => setForm({ ...form, damaged: opt.val })}
                    className={`py-3 rounded-lg border-2 transition ${
                      form.damaged === opt.val
                        ? "border-[#e67e22] bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <div className="text-sm font-medium mt-1">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live prisestimat */}
            {price && (
              <div className="bg-gradient-to-r from-[#1a365d] to-[#2a4a7f] text-white rounded-xl p-5">
                <div className="text-sm text-blue-200 mb-1">💰 Estimeret pris for din opgave</div>
                <div className="text-2xl font-bold">
                  {price.min.toLocaleString("da-DK")} — {price.max.toLocaleString("da-DK")} kr.
                </div>
                <div className="text-xs text-blue-200 mt-1">Ekskl. moms • Baseret på {form.roofArea} m² {ROOF_TYPES.find(r => r.id === form.roofType)?.name}</div>
                {price.note && <div className="text-xs text-blue-300 mt-2">ℹ️ {price.note}</div>}
              </div>
            )}
          </div>
        )}

        {/* ===== TRIN 4: Opgave ===== */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-2">🔧 Hvad ønsker du?</h2>
            <p className="text-gray-500 mb-6">Vælg en eller flere ydelser</p>

            <div className="space-y-3 mb-6">
              {[
                { id: "fjernelse", label: "Fjernelse af asbesttag", emoji: "🏗️" },
                { id: "nyt-tag", label: "Nyt tag efter fjernelse", emoji: "🏠" },
                { id: "vurdering", label: "Kun vurdering / prøvetagning", emoji: "🔬" },
                { id: "indvendig", label: "Indvendig asbestfjernelse", emoji: "🧹" },
              ].map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => toggleService(svc.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left ${
                    form.serviceType.includes(svc.id)
                      ? "border-[#e67e22] bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl">{svc.emoji}</span>
                  <span className="font-medium text-[#1a365d]">{svc.label}</span>
                  {form.serviceType.includes(svc.id) && (
                    <div className="ml-auto w-6 h-6 bg-[#e67e22] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Nyt tag valg - kun hvis "nyt-tag" er valgt */}
            {form.serviceType.includes("nyt-tag") && (
              <div className="mb-6">
                <label className="block font-bold text-[#1a365d] mb-2">Hvilken type nyt tag ønsker du?</label>
                <div className="grid grid-cols-3 gap-3">
                  {NEW_ROOF_TYPES.map((roof) => (
                    <button
                      key={roof.id}
                      onClick={() => setForm({ ...form, newRoofType: roof.id })}
                      className={`p-3 rounded-lg border-2 text-center transition ${
                        form.newRoofType === roof.id
                          ? "border-[#e67e22] bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl">{roof.emoji}</span>
                      <div className="text-xs font-medium mt-1">{roof.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tidslinje */}
            <div className="mb-6">
              <label className="block font-bold text-[#1a365d] mb-2">Hvornår skal arbejdet udføres?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: "asap", label: "Hurtigst muligt" },
                  { val: "1mdr", label: "Inden 1 måned" },
                  { val: "3mdr", label: "Inden 3 måneder" },
                  { val: "fleksibel", label: "Fleksibel" },
                ].map((t) => (
                  <button
                    key={t.val}
                    onClick={() => setForm({ ...form, timeline: t.val })}
                    className={`py-3 rounded-lg border-2 text-sm font-medium transition ${
                      form.timeline === t.val
                        ? "border-[#e67e22] bg-orange-50 text-[#e67e22]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fritekst */}
            <div>
              <label className="block font-bold text-[#1a365d] mb-2">Yderligere beskrivelse (valgfrit)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="F.eks. adgangsforhold, særlige ønsker, billeder du vil vedhæfte..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#e67e22] transition resize-none"
              />
            </div>
          </div>
        )}

        {/* ===== TRIN 5: Kontakt ===== */}
        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1a365d] mb-2">📞 Dine kontaktoplysninger</h2>
            <p className="text-gray-500 mb-6">Så virksomhederne kan kontakte dig med tilbud</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fulde navn *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Dit navn"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#e67e22] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="12 34 56 78"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#e67e22] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="din@email.dk"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#e67e22] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hvornår må vi kontakte dig?</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "formiddag", label: "🌅 Formiddag" },
                    { val: "eftermiddag", label: "☀️ Eftermiddag" },
                    { val: "aften", label: "🌙 Aften" },
                    { val: "ligemeget", label: "📞 Lige meget" },
                  ].map((t) => (
                    <button
                      key={t.val}
                      onClick={() => setForm({ ...form, contactTime: t.val })}
                      className={`py-3 rounded-lg border-2 text-sm transition ${
                        form.contactTime === t.val
                          ? "border-[#e67e22] bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sammenfatning */}
            {price && (
              <div className="mt-6 bg-[#f8f9fa] rounded-xl p-5">
                <h3 className="font-bold text-[#1a365d] mb-3">📋 Sammenfatning</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📍 {form.address || "Ikke angivet"}</p>
                  <p>🏠 {ROOF_TYPES.find(r => r.id === form.roofType)?.name} — {form.roofArea} m²</p>
                  <p>💰 Estimeret: {price.min.toLocaleString("da-DK")} — {price.max.toLocaleString("da-DK")} kr.</p>
                  <p>🔧 {form.serviceType.map(s => {
                    const labels: Record<string, string> = { fjernelse: "Fjernelse", "nyt-tag": "Nyt tag", vurdering: "Vurdering", indvendig: "Indvendig" };
                    return labels[s] || s;
                  }).join(", ") || "Ikke valgt"}</p>
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-400">
              Ved at sende accepterer du vores betingelser og privatlivspolitik. Din data deles kun med de virksomheder der afgiver tilbud.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
            >
              ← Tilbage
            </button>
          ) : (
            <div />
          )}
          
          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !form.address) ||
                (step === 2 && !form.roofType)
              }
              className="px-8 py-3 rounded-xl bg-[#e67e22] hover:bg-[#f39c12] text-white font-bold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Næste →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!form.name || !form.phone || !form.email}
              className="px-8 py-3 rounded-xl bg-[#27ae60] hover:bg-[#2ecc71] text-white font-bold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 Send forespørgsel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
