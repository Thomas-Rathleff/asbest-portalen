import virksomheder from "../../../public/data/virksomheder.json";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Virksomhed {
  navn: string;
  adresse: string;
  postnr: string;
  by: string;
  cvr: string;
  asbe_nr: string | null;
}

function getSlug(v: Virksomhed, i: number) {
  return v.asbe_nr?.toLowerCase().replace(/[^a-z0-9]/g, "-") ?? `virksomhed-${i}`;
}

export async function generateStaticParams() {
  return (virksomheder as Virksomhed[]).map((v, i) => ({ slug: getSlug(v, i) }));
}

export default function VirksomhedPage({ params }: { params: { slug: string } }) {
  const liste = virksomheder as Virksomhed[];
  const idx = liste.findIndex((v, i) => getSlug(v, i) === params.slug);
  if (idx === -1) notFound();
  const v = liste[idx];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="bg-[#1a365d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-8 h-8 bg-[#e67e22] rounded-lg flex items-center justify-center font-bold text-sm">A</div>
              <span className="text-xl font-bold">Asbest-Portalen</span>
            </Link>
            <Link href="/virksomheder" className="text-blue-200 hover:text-white text-sm transition">
              ← Alle virksomheder
            </Link>
          </div>
        </div>
      </nav>

      {/* Profil header */}
      <section className="bg-gradient-to-br from-[#1a365d] to-[#2a4a7f] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-[#e67e22] rounded-2xl flex items-center justify-center text-3xl font-bold flex-shrink-0">
              {(v.navn || v.asbe_nr || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold mb-2">
                {v.navn || `Autoriseret asbestvirksomhed`}
              </h1>
              <p className="text-blue-200 text-lg">{v.adresse}, {v.postnr} {v.by}</p>
              {v.asbe_nr && (
                <div className="mt-3 inline-flex items-center gap-2 bg-[#27ae60] px-4 py-2 rounded-full text-sm font-bold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Autoriseret · {v.asbe_nr}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Indhold */}
      <section className="py-16 bg-[#f8f9fa] flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">

          {/* Venstre: info */}
          <div className="md:col-span-2 space-y-6">
            {/* Om virksomheden */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1a365d] mb-4">Om virksomheden</h2>
              <p className="text-gray-500 leading-relaxed">
                Denne virksomhed er autoriseret af Sikkerhedsstyrelsen til at udføre asbestfjernelse og miljøsanering.
                Alle opgaver udføres i overensstemmelse med BEK 744 og gældende arbejdsmiljølovgivning.
              </p>
            </div>

            {/* Ydelser */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1a365d] mb-4">Ydelser</h2>
              <ul className="space-y-3">
                {["Asbestfjernelse og -sanering", "Nedtagning af asbesttag (eternit)", "Anmeldelse til Arbejdstilsynet", "Korrekt bortskaffelse af asbestaffald", "Miljøsanering"].map((y) => (
                  <li key={y} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-[#27ae60] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {y}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Højre: kontakt + fakta */}
          <div className="space-y-6">
            {/* Kontakt */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-[#1a365d] mb-4">Kontakt</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <div className="font-semibold text-gray-800">Adresse</div>
                  <div>{v.adresse}</div>
                  <div>{v.postnr} {v.by}</div>
                </div>
                {v.cvr && (
                  <div>
                    <div className="font-semibold text-gray-800">CVR</div>
                    <div>
                      <a
                        href={`https://www.cvr.dk/virksomhed/${v.cvr}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#e67e22] hover:underline"
                      >
                        {v.cvr} →
                      </a>
                    </div>
                  </div>
                )}
                {v.asbe_nr && (
                  <div>
                    <div className="font-semibold text-gray-800">Autorisationsnr.</div>
                    <div className="font-mono">{v.asbe_nr}</div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-[#1a365d] rounded-xl p-6 text-white text-center">
              <div className="text-lg font-bold mb-2">Få et tilbud</div>
              <p className="text-blue-200 text-sm mb-4">Indtast din adresse og få en gratis asbestvurdering</p>
              <Link
                href="/"
                className="block bg-[#e67e22] hover:bg-[#f39c12] text-white font-bold py-3 px-4 rounded-xl transition text-sm"
              >
                Tjek din bolig →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#1a365d] text-white py-8 text-center text-blue-300 text-sm">
        © 2026 Asbest-Portalen. <Link href="/" className="hover:text-white">Tilbage til forsiden</Link>
      </footer>
    </div>
  );
}
