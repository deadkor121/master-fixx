import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Clock, Award, Heart, CheckCircle } from "lucide-react";

export default function About() {
  const stats = [
    { number: "5000+", label: "Pålitelige håndverkere", icon: Users },
    { number: "50000+", label: "Utførte oppdrag", icon: CheckCircle },
    { number: "25", label: "Byer i Norge", icon: Heart },
    { number: "4.8", label: "Gjennomsnittlig vurdering", icon: Award },
  ];

  const values = [
    {
      icon: Shield,
      title: "Sikkerhet",
      description:
        "Alle håndverkere gjennomgår dokument- og kvalifikasjonskontroll",
    },
    {
      icon: Clock,
      title: "Hastighet",
      description:
        "Vi finner håndverkeren på 15 minutter, når som helst på dagen",
    },
    {
      icon: Award,
      title: "Kvalitet",
      description:
        "Vi garanterer høy kvalitet på arbeidet og beskytter dine interesser",
    },
    {
      icon: Heart,
      title: "Tillit",
      description:
        "Over 5 år med pålitelig service og tusenvis av fornøyde kunder",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenLogin={() => {}} onOpenRegister={() => {}} />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Om Master-House
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Din pålitelige partner innen <br />
              <span className="text-primary">husholdningstjenester</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master-House er Norges ledende plattform som kobler huseiere med
              pålitelige håndverkere og spesialister innen ulike fagområder.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Our Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Vår historie
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Master-House ble grunnlagt i 2019 med et enkelt mål: å gjøre
                  det enkelt og trygt å finne pålitelige håndverkere for alle
                  norske familier.
                </p>
                <p>
                  Vi startet som et lite team av entusiaster som forsto
                  utfordringene ved å finne kvalitetstjenester innen reparasjon
                  og vedlikehold av hjem. I dag er vi Norges største plattform
                  for husholdningstjenester.
                </p>
                <p>
                  Gjennom årene har vi hjulpet tusenvis av nordmenn med å finne
                  pålitelige håndverkere, og tusenvis av fagfolk har utviklet
                  sin virksomhet og funnet faste kunder.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-blue-100 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Mer enn en plattform
                </h3>
                <p className="text-gray-600">
                  Vi skaper et fellesskap av tillit mellom kunder og håndverkere
                </p>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Våre verdier
              </h2>
              <p className="text-xl text-gray-600">
                Prinsippene vi følger i vårt arbeid
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Master-House teamet
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Profesjonelle som jobber for din komfort
            </p>
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">24/7</h3>
                  <p>Kundestøtte</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">100%</h3>
                  <p>Verifiserte håndverkere</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Garanti</h3>
                  <p>På alt arbeid</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
