import { useQuery } from "@tanstack/react-query";
import { type MasterWithUser } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedMastersProps {
  onMasterSelect: (masterId: number) => void;
  onBookingOpen: (masterId: number) => void;
}

export function FeaturedMasters({ onMasterSelect, onBookingOpen }: FeaturedMastersProps) {
  const { data: masters, isLoading } = useQuery<MasterWithUser[]>({
    queryKey: ["/api/masters"],
  });

  const handleBookingClick = (e: React.MouseEvent, masterId: number) => {
    e.stopPropagation();
    onBookingOpen(masterId);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Рекомендовані майстри</h2>
            <p className="text-xl text-gray-600">Найкращі спеціалісти у вашому регіоні</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Рекомендовані майстри</h2>
          <p className="text-xl text-gray-600">Найкращі спеціалісти у вашому регіоні</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {masters?.slice(0, 3).map((master) => (
            <Card
              key={master.id}
              className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-soft-lg transition-shadow cursor-pointer"
              onClick={() => onMasterSelect(master.id)}
            >
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-gray-600">👤</span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {master.user.firstName} {master.user.lastName}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-current"
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm ml-1">
                      {parseFloat(master.rating).toFixed(1)}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className="mb-2">
                  {master.specialization}
                </Badge>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {master.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    від {master.hourlyRate} грн
                  </span>
                  <Button
                    onClick={(e) => handleBookingClick(e, master.id)}
                    className="bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    Замовити
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline"
            className="bg-white text-primary border-2 border-primary hover:bg-primary/5 font-semibold"
          >
            Переглянути всіх майстрів
          </Button>
        </div>
      </div>
    </section>
  );
}
