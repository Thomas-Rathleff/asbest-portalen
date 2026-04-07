import QuoteWizard from "../components/QuoteWizard";

export default function TilbudPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-[#1a365d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#e67e22] rounded-lg flex items-center justify-center font-bold text-sm">A</div>
              <span className="text-xl font-bold">Asbest-Portalen</span>
            </a>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="/" className="hover:text-[#f39c12] transition">Forside</a>
              <a href="/tilbud" className="text-[#f39c12]">Få tilbud</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-white py-12 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a365d] mb-3">
              Få gratis tilbud på asbestfjernelse
            </h1>
            <p className="text-gray-500 text-lg">
              Udfyld formularen og modtag op til 3 tilbud fra autoriserede virksomheder
            </p>
          </div>
          <QuoteWizard />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a365d] text-blue-300 py-8 text-center text-sm">
        © 2026 Asbest-Portalen. Alle rettigheder forbeholdes.
      </footer>
    </div>
  );
}
