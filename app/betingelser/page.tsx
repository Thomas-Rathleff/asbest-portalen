export default function Betingelser() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-[#1a365d] mb-2">Handelsbetingelser</h1>
        <p className="text-gray-400 text-sm mb-10">Sidst opdateret: april 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#1a365d] mb-3">1. Om Asbest-Portalen</h2>
            <p>Asbest-Portalen er en formidlingsplatform der forbinder boligejere med autoriserede asbestvirksomheder. Platformen drives af Playa Ejendomme ApS, CVR-nr. 42443131.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a365d] mb-3">2. Gratis for boligejere</h2>
            <p>Det er gratis at bruge Asbest-Portalen som boligejer. Du betaler intet for at få en asbestvurdering eller at blive matchet med virksomheder.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a365d] mb-3">3. Formidling — ikke rådgivning</h2>
            <p>Asbest-Portalen formidler kontakt mellem boligejere og autoriserede virksomheder. Vi er ikke ansvarlige for aftaler indgået direkte mellem boligejer og virksomhed. Vores asbestvurdering er vejledende og erstatter ikke en fysisk inspektion.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a365d] mb-3">4. Autoriserede virksomheder</h2>
            <p>Alle virksomheder på platformen er autoriseret af Sikkerhedsstyrelsen til nedrivning af asbest. Vi opdaterer registret ugentligt fra SIK's offentlige autorisationsregister.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a365d] mb-3">5. Kontakt</h2>
            <p>Spørgsmål til betingelserne? Skriv til info@asbest-portalen.dk</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <a href="/" className="text-[#e67e22] hover:underline font-semibold">← Tilbage til forsiden</a>
        </div>
      </div>
    </div>
  );
}
