import virksomheder from "../../public/data/virksomheder.json";
import Link from "next/link";

export const metadata = {
  title: "Autoriserede asbestvirksomheder | Asbest-Portalen",
  description: "Find autoriserede asbestvirksomheder i dit område. Alle virksomheder er verificeret i Sikkerhedsstyrelsens register.",
};

export default function VirksomhederPage() {
  const liste = virksomheder as { navn: string; adresse: string; postnr: string; by: string; cvr: string; asbe_nr: string | null }[];

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
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a365d] to-[#2a4a7f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Autoriserede asbestvirksomheder</h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Alle {liste.length} virksomheder er verificeret i Sikkerhedsstyrelsens autorisationsregister
          </p>
        </div>
      </section>

      {/* Liste */}
      <section className="py-16 bg-[#f8f9fa] flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liste.map((v, i) => {
              const slug = v.asbe_nr?.toLowerCase().replace(/[^a-z0-9]/g, "-") ?? `virksomhed-${i}`;
              return (
                <Link
                  key={i}
                  href={`/virksomheder/${slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6 border border-gray-100 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-[#1a365d] text-lg">
                        {v.navn || `Virksomhed ${v.asbe_nr}`}
                      </div>
                      <div className="text-gray-500 text-sm mt-1">{v.adresse}, {v.postnr} {v.by}</div>
                    </div>
                    <div className="w-10 h-10 bg-[#27ae60] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  {v.asbe_nr && (
                    <div className="text-xs font-mono bg-blue-50 text-[#1a365d] px-3 py-1 rounded-full w-fit">
                      {v.asbe_nr}
                    </div>
                  )}
                  <div className="text-[#e67e22] text-sm font-semibold mt-auto">Se profil →</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a365d] text-white py-8 text-center text-blue-300 text-sm">
        © 2026 Asbest-Portalen. <Link href="/" className="hover:text-white">Tilbage til forsiden</Link>
      </footer>
    </div>
  );
}
