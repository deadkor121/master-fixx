import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Search, Filter } from "lucide-react";
import { type MasterWithUser, type ServiceCategory } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-Debounce";
import { MasterProfileModal } from "@/components/modals/master-profile-modal";
import { BookingModal } from "@/components/modals/booking-modal";

export default function Services() {
  const [location, setLocation] = useLocation();

  // Leser query-parametere fra URL
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    const queryParam = params.get("query") || "";
    const cityParam = params.get("city") || "all";

    setSearchQuery(queryParam);
    setSelectedCity(cityParam);
  }, [location]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingMasterId, setBookingMasterId] = useState<number | null>(null);

  const handleBookingOpen = (id: number) => {
    setBookingMasterId(id);
    setBookingModalOpen(true);
  };

  const handleBookingClose = () => {
    setBookingModalOpen(false);
    setBookingMasterId(null);
  };

  const handleOpenModal = (id: number) => {
    setSelectedMasterId(id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMasterId(null);
  };

  const debouncedQuery = useDebounce(searchQuery, 500);

  const { data: categories } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
    queryFn: () => fetch("/api/categories").then((res) => res.json()),
  });

  const { data: masters, isLoading } = useQuery<MasterWithUser[]>({
    queryKey: [
      "/api/search",
      { query: debouncedQuery, city: selectedCity, category: selectedCategory },
    ],
    queryFn: () => {
      const params = new URLSearchParams();
      if (debouncedQuery) params.append("query", debouncedQuery);
      if (selectedCity !== "all") params.append("city", selectedCity);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);

      return fetch(`/api/search?${params.toString()}`).then((res) =>
        res.json()
      );
    },
  });

  const filteredMasters = masters?.filter((master) => {
    if (
      selectedCategory !== "all" &&
      !master.services.some(
        (service) => service.categoryId === parseInt(selectedCategory)
      )
    ) {
      return false;
    }
    return true;
  });

  // Oppdaterer URL automatisk ved endring i søk eller by
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (selectedCity !== "all") params.set("city", selectedCity);

    setLocation(`/services?${params.toString()}`, { replace: true });
  }, [searchQuery, selectedCity, setLocation]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenLogin={() => {}} onOpenRegister={() => {}} />

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sidetopp */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Finn en håndverker
            </h1>
            <p className="text-xl text-gray-600">
              Profesjonelle spesialister klare til å hjelpe deg
            </p>
          </div>

          {/* Søk og filtre */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Søk etter spesialitet eller navn..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle kategorier</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oslo">Oslo</SelectItem>
                      <SelectItem value="bergen">Bergen</SelectItem>
                      <SelectItem value="trondheim">Trondheim</SelectItem>
                      <SelectItem value="stavanger">Stavanger</SelectItem>
                      <SelectItem value="tromso">Tromsø</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultater */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Søkeresultater
            </h2>
            <div className="flex items-center space-x-2 text-gray-600">
              <Filter className="h-4 w-4" />
              <span>Funnet: {filteredMasters?.length || 0} håndverkere</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMasters?.map((master) => (
                <Card
                  key={master.id}
                  className="hover:shadow-lg transition-shadow"
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
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span>
                          {master.rating != null
                            ? parseFloat(master.rating.toString()).toFixed(1)
                            : "0.0"}
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
                        fra {master.hourlyRate} грн
                      </span>
                      <Button
                        onClick={() => handleOpenModal(master.id)}
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        Se detaljer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredMasters?.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ingenting funnet
              </h3>
              <p className="text-gray-600">
                Prøv å endre søkekriteriene eller filtrene.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modal for håndverkerprofil */}
      {selectedMasterId && (
        <MasterProfileModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          masterId={selectedMasterId}
          onBookingOpen={handleBookingOpen}
        />
      )}

      {/* Booking-modal */}
      {bookingMasterId && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={handleBookingClose}
          masterId={bookingMasterId}
        />
      )}
    </div>
  );
}
