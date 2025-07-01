import { Search, Users, CheckCircle } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Velg en tjeneste",
      description: "Velg ønsket tjenestekategori eller bruk søkefunksjonen",
    },
    {
      icon: Users,
      title: "Velg en håndverker",
      description:
        "Se profiler, vurderinger og priser. Velg den beste spesialisten",
    },
    {
      icon: CheckCircle,
      title: "Bestill tjenesten",
      description:
        "Kontakt håndverkeren, diskuter detaljene og avtal tidspunkt",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hvordan det fungerer
          </h2>
          <p className="text-xl text-gray-600">
            Enkel måte å finne en håndverker på – i 3 steg
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-balance">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
