import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserCheck, Calendar, CheckCircle, Star, Shield, Clock } from "lucide-react";
export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Velg tjeneste",
      description: "Finn riktig spesialist blant mer enn 50 tjenestekategorier, eller bruk søkefunksjonen",
      details: ["Søk etter kategori", "Filtrer etter by", "Se vurderinger"]
    },
    {
      number: "02", 
      icon: UserCheck,
      title: "Velg håndverker",
      description: "Se håndverkerprofiler, les anmeldelser og velg den beste for dine behov",
      details: ["Arbeidsportefølje", "Kundeanmeldelser", "Priser på tjenester"]
    },
    {
      number: "03",
      icon: Calendar,
      title: "Bestill tid",
      description: "Velg en passende tid og dato, beskriv arbeidsoppgaven, og bekreft bestillingen",
      details: ["Online kalender", "Oppgavebeskrivelse", "Bekreftelse fra håndverker"]
    },
    {
      number: "04",
      icon: CheckCircle,
      title: "Få resultatet",
      description: "Håndverkeren utfører jobben med kvalitet og til avtalt tid. Betal etter fullført arbeid",
      details: ["Kvalitetsutførelse", "Betaling etter arbeid", "Garanti på tjenester"]
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Sikkerhet",
      description: "Alle håndverkere er verifisert, forsikret og har nødvendige dokumenter"
    },
    {
      icon: Star,
      title: "Kvalitet",
      description: "Systemet med vurderinger og anmeldelser sikrer høy kvalitet på tjenestene"
    },
    {
      icon: Clock,
      title: "Raskt",
      description: "Finn håndverker på få minutter, når som helst på døgnet"
    }

  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenLogin={() => {}} onOpenRegister={() => {}} />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Hvordan det fungerer
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Å finne en håndverker er like enkelt som
              <br />
              <span className="text-primary">å telle til fire</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              N vår plattform gjør søk og bestilling av håndverkertjenester
              maksimalt enkelt og praktisk. Fire steg til resultatet.
            </p>
          </div>

          {/* Steps */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-200 transform translate-x-4">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
                      </div>
                    )}
                    <Card className="text-center hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-6">
                        <div className="relative mb-6">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon className="h-8 w-8 text-primary" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {step.number}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{step.description}</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                          {step.details.map((detail, idx) => (
                            <li
                              key={idx}
                              className="flex items-center justify-center"
                            >
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Hvorfor velge Master-House
              </h2>
              <p className="text-xl text-gray-600">
                Fordeler som gjør oss til de beste
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="p-8">
                      <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ofte stilte spørsmål
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hvordan foregår betalingen?
                  </h3>
                  <p className="text-gray-600">
                    Betaling skjer etter fullført arbeid, enten direkte til
                    håndverkeren eller via plattformen. Du kan velge
                    betalingsmåte som passer deg .
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hva gjør jeg hvis resultatet ikke er tilfredsstillende?
                  </h3>
                  <p className="text-gray-600">
                    Alle arbeider utføres med garanti. Hvis du er misfornøyd med
                    resultatet, vennligst kontakt kundeservice - vi vil hjelpe
                    deg med å løse problemet.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hvor raskt kan jeg finne en håndverker?
                  </h3>
                  <p className="text-gray-600">
                    Vanligvis kan du finne en håndverker innen 15-30 minutter. I
                    tilfelle av akutte oppdrag er det tilgjengelig en funksjon
                    for "akuttanrop".
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Kan jeg endre tidspunkt for bestillingen?
                  </h3>
                  <p className="text-gray-600">
                    Ja, du kan flytte bestillingen ved å kontakte håndverkeren
                    eller via din personlige konto på plattformen.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-primary to-blue-600">
              <CardContent className="p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">Klar til å prøve?</h2>
                <p className="text-xl mb-8 opacity-90">
                  Bli med blant tusenvis av fornøyde kunder hos Master-House
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary">
                    Finn en håndverker
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-primary"
                  >
                    Bli håndverker
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
