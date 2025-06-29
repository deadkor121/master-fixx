import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Clock, Award, Heart, CheckCircle } from "lucide-react";

export default function About() {
  const stats = [
    { number: "5000+", label: "Довірених майстрів", icon: Users },
    { number: "50000+", label: "Виконаних замовлень", icon: CheckCircle },
    { number: "25", label: "Міст України", icon: Heart },
    { number: "4.8", label: "Середня оцінка", icon: Award }
  ];

  const values = [
    {
      icon: Shield,
      title: "Безпека",
      description: "Всі майстри проходять перевірку документів та кваліфікації"
    },
    {
      icon: Clock,
      title: "Швидкість",
      description: "Знаходимо майстра за 15 хвилин у будь-який час доби"
    },
    {
      icon: Award,
      title: "Якість",
      description: "Гарантуємо високу якість робіт та захист ваших інтересів"
    },
    {
      icon: Heart,
      title: "Довіра",
      description: "Понад 5 років надійного сервісу та тисячі задоволених клієнтів"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onOpenLogin={() => {}}
        onOpenRegister={() => {}}
      />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Про Master-House
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ваш надійний партнер у <br />
              <span className="text-primary">побутових послугах</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master-House - це провідна платформа України, що з'єднує домовласників 
              з перевіреними майстрами та фахівцями різних спеціальностей.
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
                    <div className="text-gray-600 text-sm">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Our Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Наша історія
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Master-House була заснована у 2019 році з простою місією: зробити 
                  пошук надійних майстрів простим та безпечним для кожної української родини.
                </p>
                <p>
                  Ми розпочали як невелика команда ентузіастів, які розуміли проблеми 
                  пошуку якісних послуг у сфері ремонту та обслуговування будинків. 
                  Сьогодні ми - найбільша платформа побутових послуг в Україні.
                </p>
                <p>
                  За роки роботи ми допомогли тисячам українців знайти надійних майстрів, 
                  а тисячам професіоналів - розвинути свій бізнес та знайти постійних клієнтів.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-blue-100 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Більше ніж платформа
                </h3>
                <p className="text-gray-600">
                  Ми створюємо спільноту довіри між клієнтами та майстрами
                </p>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Наші цінності
              </h2>
              <p className="text-xl text-gray-600">
                Принципи, якими ми керуємося у роботі
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Команда Master-House
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Професіонали, які працюють заради вашого комфорту
            </p>
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">24/7</h3>
                  <p>Підтримка клієнтів</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">100%</h3>
                  <p>Перевірені майстри</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Гарантія</h3>
                  <p>На всі роботи</p>
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