import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function WorkGallery() {
  const galleryItems = [
    {
      id: 1,
      title: "Ремонт ванної кімнати",
      category: "Сантехніка",
      masterName: "Олександр Петренко",
      rating: 4.9,
      price: "від 2500 грн",
      image: "🛁",
      description: "Повний ремонт ванної кімнати з заміною сантехніки"
    },
    {
      id: 2,
      title: "Встановлення кондиціонера",
      category: "Електрика",
      masterName: "Ігор Коваленко",
      rating: 4.8,
      price: "від 1800 грн",
      image: "❄️",
      description: "Професійне встановлення та налаштування кондиціонера"
    },
    {
      id: 3,
      title: "Укладання плитки",
      category: "Ремонт",
      masterName: "Василь Іваненко",
      rating: 5.0,
      price: "від 400 грн/м²",
      image: "🔲",
      description: "Якісне укладання керамічної плитки"
    },
    {
      id: 4,
      title: "Встановлення меблів",
      category: "Збірка меблів",
      masterName: "Андрій Сидоренко",
      rating: 4.7,
      price: "від 300 грн",
      image: "🪑",
      description: "Швидке та професійне збирання меблів"
    },
    {
      id: 5,
      title: "Прибирання після ремонту",
      category: "Клінінг",
      masterName: "Марія Ткаченко",
      rating: 4.9,
      price: "від 25 грн/м²",
      image: "🧽",
      description: "Генеральне прибирання після будівельних робіт"
    },
    {
      id: 6,
      title: "Ремонт пральної машини",
      category: "Побутова техніка",
      masterName: "Сергій Морозов",
      rating: 4.8,
      price: "від 500 грн",
      image: "🔧",
      description: "Діагностика та ремонт пральних машин"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Галерея робіт наших майстрів
          </h2>
          <p className="text-xl text-gray-600">
            Переглядайте приклади якісно виконаних робіт
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
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
                
                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Майстер:</p>
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
          <p className="text-gray-600 mb-4">
            Хочете бачити свої роботи тут?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Стати майстром
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Переглянути всі роботи
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}