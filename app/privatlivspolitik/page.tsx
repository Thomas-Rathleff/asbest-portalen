export default function Privatlivspolitik() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-[#1a365d] mb-2">Privatlivspolitik</h1>
        <p className="text-gray-400 text-sm mb-10">Sidst opdateret: april 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#1a365d] mb-3">1. Dataansvarlig</h2>
            <p>Asbest-Portalen drives af Playa Ejendomme ApS, CVR-nr. 42443131, Iranvej 33, 2300 København S. Kontakt: info@asbest-portalen.dk</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a365d] mb-3">2. Hvilke oplysninger indsamler vi?</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Navn</li>
              <li>E-mailadresse</li>
              <li>Telefonnummer</li>
              <li>Adresse (til asbestvurdering)</li>
              <li>Oplysninger om bolig (byggeår, tagtype)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a365d] mb-3">3. Formål og retsgrundlag</h2>
            <p>Vi behandler dine oplysninger for at:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Formidle kontakt mellem dig og autoriserede asbestvirksomheder (samtykke, GDPR art. 6, stk. 1, litra a)</li>
              <li>Sende dig relevante tilbud fra virksomheder i dit område</li>
              <li>Forbedre vores platform og services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a365d] mb-3">4. Videregivelse af oplysninger</h2>
            <p>Dine kontaktoplysninger videregives til maksimalt 3 autoriserede asbestvirksomheder, som vil kontakte dig med tilbud. Vi sælger aldrig dine oplysninger til tredjeparter.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a365d] mb-3">5. Opbevaring</h2>
            <p>Vi opbevarer dine oplysninger i op til 12 måneder efter din forespørgsel, hvorefter de slettes automatisk.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a365d] mb-3">6. Dine rettigheder</h2>
            <p>Du har ret til indsigt, berigtigelse, sletning, begrænsning og dataportabilitet. Kontakt os på info@asbest-portalen.dk for at udøve dine rettigheder. Du kan også klage til Datatilsynet på dt.dk.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1a365d] mb-3">7. Cookies</h2>
            <p>Vi anvender tekniske cookies der er nødvendige for at platformen fungerer. Vi anvender ikke tracking-cookies uden dit samtykke.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <a href="/" className="text-[#e67e22] hover:underline font-semibold">← Tilbage til forsiden</a>
        </div>
      </div>
    </div>
  );
}
