import AddressSearch from "./components/AddressSearch";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ===== NAVIGATION ===== */}
      <nav className="bg-[#1a365d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#e67e22] rounded-lg flex items-center justify-center font-bold text-sm">A</div>
              <span className="text-xl font-bold">Asbest-Portalen</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#" className="hover:text-[#f39c12] transition">Tjek din bolig</a>
              <a href="#" className="hover:text-[#f39c12] transition">Videnscenter</a>
              <a href="#" className="hover:text-[#f39c12] transition">Find virksomhed</a>
              <a href="#" className="hover:text-[#f39c12] transition">For virksomheder</a>
              <a href="#" className="bg-[#e67e22] hover:bg-[#f39c12] px-4 py-2 rounded-lg transition font-semibold">Få gratis tilbud</a>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-br from-[#1a365d] via-[#2a4a7f] to-[#1a365d] text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Har dit hus asbest<span className="text-[#e67e22]">?</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto mb-10">
            Indtast din adresse og få en gratis vurdering af om din bolig indeholder asbestholdige materialer. Hurtigt, nemt og uforpligtende.
          </p>
          
          {/* Søgefelt med live adresseopslag */}
          <AddressSearch />

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <div className="text-3xl font-bold">300K+</div>
              <div className="text-blue-200 text-sm mt-1">Huse med asbest i DK</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Gratis</div>
              <div className="text-blue-200 text-sm mt-1">Asbestvurdering</div>
            </div>
            <div>
              <div className="text-3xl font-bold">2 min</div>
              <div className="text-blue-200 text-sm mt-1">Hurtigt resultat</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SÅDAN VIRKER DET ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-4">Sådan virker det</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Fra adressesøgning til færdig asbestfjernelse — vi guider dig hele vejen</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e67e22] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">1</div>
              <h3 className="text-xl font-bold text-[#1a365d] mb-3">Indtast din adresse</h3>
              <p className="text-gray-500 leading-relaxed">Vi henter automatisk data om din bolig fra BBR — byggeår, tagmateriale og areal.</p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e67e22] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">2</div>
              <h3 className="text-xl font-bold text-[#1a365d] mb-3">Få din vurdering</h3>
              <p className="text-gray-500 leading-relaxed">Vores system analyserer data og giver dig en risikoscore for asbest i din bolig.</p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e67e22] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg">3</div>
              <h3 className="text-xl font-bold text-[#1a365d] mb-3">Få tilbud fra eksperter</h3>
              <p className="text-gray-500 leading-relaxed">Modtag tilbud fra autoriserede asbestvirksomheder i dit område — nemt og gratis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOR HUSEJERE ===== */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-sm font-semibold text-[#e67e22] uppercase tracking-wider mb-3">For husejere</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-6">Er dit tag fra før 1990?</h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Hvis dit hus er bygget mellem 1920 og 1990, er der stor sandsynlighed for at taget indeholder asbestholdige materialer som eternit. Det er lovpligtigt at få det fjernet korrekt.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#27ae60] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-gray-700">Gratis asbestvurdering baseret på BBR-data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#27ae60] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-gray-700">Se hvordan dit hus ser ud med nyt tag</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#27ae60] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-gray-700">Modtag tilbud fra autoriserede virksomheder</span>
                </li>
              </ul>
              <a href="#" className="inline-flex items-center bg-[#e67e22] hover:bg-[#f39c12] text-white font-bold py-3 px-6 rounded-xl transition shadow-lg">
                Tjek din bolig nu →
              </a>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center text-gray-400 py-20">
                <div className="text-6xl mb-4">🏠</div>
                <p className="text-lg font-medium">Eksempel på asbestvurdering</p>
                <p className="text-sm mt-2">Billedvisning kommer snart</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOR VIRKSOMHEDER ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 bg-[#1a365d] rounded-2xl p-8 text-white">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#e67e22] rounded-xl flex items-center justify-center font-bold">📊</div>
                  <div>
                    <div className="font-bold">Kvalificerede leads</div>
                    <div className="text-blue-200 text-sm">Husejere der aktivt søger asbestfjernelse</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#e67e22] rounded-xl flex items-center justify-center font-bold">⭐</div>
                  <div>
                    <div className="font-bold">Virksomhedsprofil</div>
                    <div className="text-blue-200 text-sm">Vis certificeringer og kundeanmeldelser</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#e67e22] rounded-xl flex items-center justify-center font-bold">🔧</div>
                  <div>
                    <div className="font-bold">Beregningsværktøjer</div>
                    <div className="text-blue-200 text-sm">Kalkuler pris og tid direkte på platformen</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-sm font-semibold text-[#e67e22] uppercase tracking-wider mb-3">For virksomheder</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-6">Få flere kunder til din asbestvirksomhed</h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Tilmeld din virksomhed og få direkte adgang til husejere der søger asbestfjernelse. Ingen tomme leads — kun kunder der er klar til at handle.
              </p>
              <a href="#" className="inline-flex items-center bg-[#1a365d] hover:bg-[#2a4a7f] text-white font-bold py-3 px-6 rounded-xl transition shadow-lg">
                Tilmeld din virksomhed →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VIDENSCENTER PREVIEW ===== */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-4">Videnscenter</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Alt du skal vide om asbest i danske boliger</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6 border border-gray-100">
              <div className="text-3xl mb-4">⚠️</div>
              <h3 className="text-lg font-bold text-[#1a365d] mb-2">Hvad er asbest?</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Asbest er sundhedsfarligt og blev brugt massivt i dansk byggeri fra 1920-1990. Lær om risici og lovkrav.</p>
              <a href="#" className="text-[#e67e22] font-semibold text-sm mt-4 inline-block hover:underline">Læs mere →</a>
            </div>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6 border border-gray-100">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-lg font-bold text-[#1a365d] mb-2">Regler og lovkrav</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Asbestfjernelse kræver autorisation. Få overblik over BEK 744, anmeldelse til AT og korrekt affaldshåndtering.</p>
              <a href="#" className="text-[#e67e22] font-semibold text-sm mt-4 inline-block hover:underline">Læs mere →</a>
            </div>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6 border border-gray-100">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-[#1a365d] mb-2">Hvad koster det?</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Prisen afhænger af tagtype, størrelse og tilstand. Se priseksempler og få et uforpligtende tilbud.</p>
              <a href="#" className="text-[#e67e22] font-semibold text-sm mt-4 inline-block hover:underline">Læs mere →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-gradient-to-r from-[#e67e22] to-[#f39c12] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Klar til at tjekke din bolig?</h2>
          <p className="text-xl text-orange-100 mb-10">Det tager kun 2 minutter og er helt gratis</p>
          <a href="#" className="inline-flex items-center bg-white text-[#e67e22] font-bold py-4 px-8 rounded-xl text-lg hover:bg-orange-50 transition shadow-lg">
            Tjek din bolig nu →
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#1a365d] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#e67e22] rounded-lg flex items-center justify-center font-bold text-sm">A</div>
                <span className="text-lg font-bold">Asbest-Portalen</span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">Danmarks platform for asbestvurdering og forbindelse mellem husejere og autoriserede asbestvirksomheder.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">For husejere</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><a href="#" className="hover:text-white transition">Tjek din bolig</a></li>
                <li><a href="#" className="hover:text-white transition">Få tilbud</a></li>
                <li><a href="#" className="hover:text-white transition">Videnscenter</a></li>
                <li><a href="#" className="hover:text-white transition">Priser</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For virksomheder</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li><a href="#" className="hover:text-white transition">Tilmeld virksomhed</a></li>
                <li><a href="#" className="hover:text-white transition">Priser og abonnement</a></li>
                <li><a href="#" className="hover:text-white transition">Sådan virker det</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Kontakt</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>info@asbest-portalen.dk</li>
                <li><a href="#" className="hover:text-white transition">Om os</a></li>
                <li><a href="#" className="hover:text-white transition">Privatlivspolitik</a></li>
                <li><a href="#" className="hover:text-white transition">Betingelser</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-12 pt-8 text-center text-blue-300 text-sm">
            © 2026 Asbest-Portalen. Alle rettigheder forbeholdes.
          </div>
        </div>
      </footer>
    </div>
  );
}
