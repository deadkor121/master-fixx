import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function WorkGallery() {
  const galleryItems = [
    {
      id: 1,
      title: "Badromsrenovering",
      category: "Rørlegger",
      masterName: "Oleksandr Petrenko",
      rating: 4.9,
      price: "fra 2500 NOK",
      image: "🛁",
      description: "Full badromsrenovering med utskifting av rørleggerarbeid",
    },
    {
      id: 2,
      title: "Installasjon av klimaanlegg",
      category: "Elektriker",
      masterName: "Ihor Kovalenko",
      rating: 4.8,
      price: "fra 1800 NOK",
      image: "❄️",
      description: "Profesjonell installasjon og oppsett av klimaanlegg",
    },
    {
      id: 3,
      title: "Flislegging",
      category: "Reparasjon",
      masterName: "Vasyl Ivanenko",
      rating: 5.0,
      price: "fra 400 NOK/m²",
      image: "🔲",
      description: "Kvalitetsflislegging av keramiske fliser",
    },
    {
      id: 4,
      title: "Møbelmontering",
      category: "Møbelmontering",
      masterName: "Andriy Sydorenko",
      rating: 4.7,
      price: "fra 300 NOK",
      image: "🪑",
      description: "Rask og profesjonell montering av møbler",
    },
    {
      id: 5,
      title: "Rengjøring etter renovering",
      category: "Rengjøring",
      masterName: "Maria Tkachenko",
      rating: 4.9,
      price: "fra 25 NOK/m²",
      image: "🧽",
      description: "Grundig rengjøring etter byggearbeid",
    },
    {
      id: 6,
      title: "Reparasjon av vaskemaskin",
      category: "Husholdningsapparater",
      masterName: "Serhiy Morozov",
      rating: 4.8,
      price: "fra 500 NOK",
      image: "🔧",
      description: "Diagnostikk og reparasjon av vaskemaskiner",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Galleri med arbeid fra våre fagfolk
          </h2>
          <p className="text-xl text-gray-600">
            Se eksempler på kvalitetsarbeid
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                {item.image}
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Fagperson:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {item.masterName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {item.price}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Vil du vise dine arbeider her?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Bli en fagperson
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Se alle arbeider
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
