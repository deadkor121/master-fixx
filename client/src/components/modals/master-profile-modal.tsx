import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Check, Phone, MessageCircle, Clock, Users, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { type MasterWithUser, type ReviewWithDetails } from "@/types";

interface MasterProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingOpen: (masterId: number) => void;
  masterId: number | null;
}

export function MasterProfileModal({ 
  isOpen, 
  onClose, 
  onBookingOpen, 
  masterId 
}: MasterProfileModalProps) {
  const { data: master, isLoading } = useQuery<MasterWithUser>({
    queryKey: ["/api/masters", masterId],
    enabled: !!masterId && isOpen,
  });

  const { data: reviews } = useQuery<ReviewWithDetails[]>({
    queryKey: ["/api/masters", masterId, "reviews"],
    enabled: !!masterId && isOpen,
  });

  const handleBookingClick = () => {
    if (masterId) {
      onClose();
      onBookingOpen(masterId);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <Skeleton className="w-32 h-32 rounded-2xl mx-auto md:mx-0" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!master) return null;

  const specializations = [
    "Усунення протікань",
    "Встановлення сантехніки", 
    "Ремонт труб",
    "Заміна змішувачів",
  ];

  const services = [
    { name: "Усунення протікань", description: "Крани, змішувачі, з'єднання труб", price: "від 300 грн" },
    { name: "Встановлення унітазу", description: "Демонтаж старого, встановлення нового", price: "від 800 грн" },
    { name: "Заміна змішувача", description: "Кухня або ванна кімната", price: "від 400 грн" },
    { name: "Прочищення каналізації", description: "Механічне та хімічне прочищення", price: "від 500 грн" },
  ];

  const sampleReviews = [
    {
      name: "Марія К.",
      rating: 5,
      text: "Чудовий майстер! Швидко приїхав, професійно усунув протікання в ванній. Роботу виконав акуратно, прибрав за собою. Рекомендую!",
      date: "2 дні тому",
    },
    {
      name: "Олексій В.",
      rating: 5,
      text: "Встановлював новий унітаз. Все зробив швидко та якісно. Ціна адекватна. Дав корисні поради по догляду. Буду звертатися ще.",
      date: "1 тиждень тому",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Master Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-32 h-32 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-2xl text-gray-600">👤</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {master.user.firstName} {master.user.lastName}
              </h2>
              <p className="text-xl text-primary font-semibold mb-3">{master.specialization}</p>
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold">{parseFloat(master.rating).toFixed(1)}</span>
                  <span className="text-gray-600">({master.reviewCount} відгуків)</span>
                </div>
                <div className="text-gray-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{master.experience}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Перевірений майстер
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Аварійні виклики
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Гарантія 1 рік
                </Badge>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-3xl font-bold text-gray-900 mb-2">від {master.hourlyRate} грн</p>
              <Button
                onClick={handleBookingClick}
                className="bg-primary text-white hover:bg-primary/90 font-semibold mb-2"
              >
                Замовити послугу
              </Button>
              <div className="flex justify-center md:justify-end space-x-2">
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Огляд</TabsTrigger>
              <TabsTrigger value="services">Послуги та ціни</TabsTrigger>
              <TabsTrigger value="reviews">Відгуки</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Про майстра</h3>
                  <p className="text-gray-600 mb-6">{master.description}</p>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Спеціалізація</h4>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {specializations.map((spec, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Target className="w-8 h-8 text-primary" />
                          <div>
                            <div className="text-2xl font-bold text-gray-900">{master.completedJobs}</div>
                            <div className="text-gray-600 text-sm">Виконаних робіт</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-8 h-8 text-primary" />
                          <div>
                            <div className="text-2xl font-bold text-gray-900">{master.responseTime}</div>
                            <div className="text-gray-600 text-sm">Час відповіді</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Users className="w-8 h-8 text-primary" />
                          <div>
                            <div className="text-2xl font-bold text-gray-900">{master.repeatClients}%</div>
                            <div className="text-gray-600 text-sm">Повторних клієнтів</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Послуги та ціни</h3>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">{service.name}</h4>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{service.price}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Відгуки клієнтів</h3>
              <div className="space-y-6">
                {sampleReviews.map((review, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600">👤</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{review.name}</h4>
                            <div className="flex text-yellow-400">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2">{review.text}</p>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
