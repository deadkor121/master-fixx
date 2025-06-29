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
      title: "Оберіть послугу",
      description: "Знайдіть потрібного спеціаліста серед більш ніж 50 категорій послуг або скористайтеся пошуком",
      details: ["Пошук за категорією", "Фільтри за містом", "Перегляд рейтингів"]
    },
    {
      number: "02", 
      icon: UserCheck,
      title: "Виберіть майстра",
      description: "Переглядайте профілі майстрів, читайте відгуки та обирайте найкращого для ваших потреб",
      details: ["Портфоліо робіт", "Відгуки клієнтів", "Ціни на послуги"]
    },
    {
      number: "03",
      icon: Calendar,
      title: "Забронюйте час",
      description: "Оберіть зручний час та дату, опишіть деталі роботи та підтвердіть замовлення",
      details: ["Онлайн календар", "Опис завдання", "Підтвердження майстра"]
    },
    {
      number: "04",
      icon: CheckCircle,
      title: "Отримайте результат",
      description: "Майстер виконає роботу якісно та в строк. Оплачуйте після завершення",
      details: ["Якісне виконання", "Оплата після роботи", "Гарантія на послуги"]
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Безпека",
      description: "Всі майстри перевірені, застраховані та мають необхідні документи"
    },
    {
      icon: Star,
      title: "Якість",
      description: "Система рейтингів та відгуків гарантує високу якість послуг"
    },
    {
      icon: Clock,
      title: "Швидкість",
      description: "Знаходьте майстра за лічені хвилини у будь-який час доби"
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
              Як це працює
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Знайти майстра просто як <br />
              <span className="text-primary">рахувати до чотирьох</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Наша платформа робить пошук та замовлення послуг майстрів максимально 
              простим та зручним. Чотири кроки до результату.
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
                        <p className="text-gray-600 mb-4">
                          {step.description}
                        </p>
                        <ul className="text-sm text-gray-500 space-y-1">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center justify-center">
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
                Чому обирають Master-House
              </h2>
              <p className="text-xl text-gray-600">
                Переваги, які роблять нас найкращими
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
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
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
                Часті питання
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Як відбувається оплата?
                  </h3>
                  <p className="text-gray-600">
                    Оплата здійснюється після завершення робіт безпосередньо майстру 
                    або через платформу. Ви можете обрати зручний спосіб оплати.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Що робити, якщо результат не задовольняє?
                  </h3>
                  <p className="text-gray-600">
                    Всі роботи виконуються з гарантією. У разі незадоволення результатом, 
                    зверніться до служби підтримки - ми допоможемо вирішити питання.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Як швидко можна знайти майстра?
                  </h3>
                  <p className="text-gray-600">
                    Зазвичай майстра можна знайти за 15-30 хвилин. У випадку термінових 
                    робіт доступна функція "термінового виклику".
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Чи можна змінити час замовлення?
                  </h3>
                  <p className="text-gray-600">
                    Так, ви можете перенести замовлення, зв'язавшись з майстром 
                    або через особистий кабінет на платформі.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-primary to-blue-600">
              <CardContent className="p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Готові спробувати?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Приєднуйтесь до тисяч задоволених клієнтів Master-House
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary">
                    Знайти майстра
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                    Стати майстром
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