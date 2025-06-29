import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Check,
  Phone,
  MessageCircle,
  Clock,
  Users,
  Target,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import type { ReviewWithDetails, ServiceCategory, PublicUser } from "@/types";

// 🔑 Правильный тип — твой собственный
interface Service {
  name: string;
  description: string;
  price: string;
}

interface MasterWithUser {
  id: number;
  user: PublicUser;
  specialization: string;
  hourlyRate: string;
  rating: string | number;
  reviewCount: number;
  completedJobs: number;
  responseTime: string;
  clientsCount: number;
  description: string;
  avatar?: string;
  isVerified: boolean;
  services?: Service[];
  category?: ServiceCategory;
}

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
  masterId,
}: MasterProfileModalProps) {
  useEffect(() => {
    console.log("MasterProfileModal masterId:", masterId);
    console.log("MasterProfileModal isOpen:", isOpen);
  }, [masterId, isOpen]);

  const { data: master, isLoading: isMasterLoading } = useQuery<MasterWithUser>(
    {
      queryKey: ["/api/masters", masterId],
      enabled: !!masterId && isOpen,
      queryFn: async () => {
        const { data } = await axios.get<MasterWithUser>(
          `/api/masters/${masterId}`
        );
        return data;
      },
    }
  );

  const { data: reviews, isLoading: isReviewsLoading } = useQuery<
    ReviewWithDetails[]
  >({
    queryKey: ["/api/masters", masterId, "reviews"],
    enabled: !!masterId && isOpen,
    queryFn: async () => {
      const { data } = await axios.get<ReviewWithDetails[]>(
        `/api/masters/${masterId}/reviews`
      );
      return data;
    },
  });

  const handleBookingClick = () => {
    if (masterId !== null) {
      onClose();
      onBookingOpen(masterId);
    }
  };

  if (isMasterLoading || isReviewsLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <Skeleton className="w-32 h-32 rounded-2xl mx-auto md:mx-0" />
            <Skeleton className="h-8 w-48 mt-4" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!master) return null;

  const services = master.services ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-32 h-32 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
              <span className="text-2xl">👤</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold">
                {master.user?.firstName} {master.user?.lastName}
              </h2>
              <p className="text-xl text-primary font-semibold">
                {master.specialization}
              </p>
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-semibold">
                  {master.rating !== null && master.rating !== undefined
                    ? Number(master.rating).toFixed(1)
                    : "0.0"}
                </span>
                <span className="text-gray-600">
                  ({master.reviewCount ?? 0} відгуків)
                </span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Перевірений майстер
                </Badge>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-3xl font-bold mb-2">
                від {master.hourlyRate} грн
              </p>
              <Button onClick={handleBookingClick} className="mb-2">
                Замовити послугу
              </Button>
              <div className="flex justify-center md:justify-end space-x-2">
              <a href={`tel:${master.user.phone}`}>
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                  </Button>
              </a>
                <Button variant="outline" size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Огляд</TabsTrigger>
              <TabsTrigger value="services">Послуги та ціни</TabsTrigger>
              <TabsTrigger value="reviews">Відгуки</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <p className="mb-2">
                <b>Про себе:</b> {master.user.about || "—"}
              </p>
              <p className="mb-2">
                <b>Місто:</b> {master.user.city || "—"}
              </p>
              <p className="mb-2">
                <b>Дата народження:</b> {master.user.birthDate || "—"}
              </p>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Послуги та ціни</h3>
              {services.length > 0 ? (
                services.map((service, idx) => (
                  <Card key={idx} className="mb-2">
                    <CardContent className="p-4 flex justify-between">
                      <div>
                        <div className="font-semibold">{service.name}</div>
                        <div className="text-sm text-gray-600">
                          {service.description}
                        </div>
                      </div>
                      <div className="text-primary font-semibold">
                        від {service.price} грн
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-600">Немає послуг у цього майстра.</p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Відгуки клієнтів</h3>
              {reviews && reviews.length > 0 ? (
                reviews.map((review, idx) => (
                  <Card key={idx} className="mb-2">
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">
                          {review.client.firstName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex text-yellow-400 mb-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p>{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-600">Немає відгуків поки що.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
