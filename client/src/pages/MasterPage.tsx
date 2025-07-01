// src/pages/MastersPage.tsx

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MasterProfileModal } from "@/components/modals/master-profile-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { type MasterWithUser } from "@shared/schema";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { BookingModal } from "@/components/modals/booking-modal";

export default function MastersPage() {
  const {
    data: masters,
    isLoading,
    error,
  } = useQuery<MasterWithUser[]>({
    queryKey: ["/api/masters"],
    queryFn: async () => {
      const res = await fetch("/api/masters");
      if (!res.ok) throw new Error("Kunne ikke hente mestre");
      return res.json();
    },
  });
  console.log("Masters data:", masters, "Loading:", isLoading);

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingMasterId, setBookingMasterId] = useState<number | null>(null);
  const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleBookingOpen = (id: number | null) => {
    console.log("handleBookingOpen kalt med id:", id);
    if (!id) return;
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

  const handleLogin = () => alert("Åpne innloggingsmodal");
  const handleRegister = () => alert("Åpne registreringsmodal");

  return (
    <>
      <Header onOpenLogin={handleLogin} onOpenRegister={handleRegister} />
      <div className="container py-10 text-center">
        <Badge variant="secondary" className="mb-4">
          Om Mestre
        </Badge>
        <h1 className="text-3xl font-bold mb-6">Våre mestere</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {masters?.map((master) => (
              <Card key={master.id} className="hover:shadow-lg transition">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">
                        {master.user?.firstName} {master.user?.lastName}
                      </h2>
                      <p className="text-sm text-primary">
                        {master.specialization}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mt-3 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-gray-700">
                      {parseFloat(master.rating?.toString() || "0").toFixed(1)}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleOpenModal(master.id)}
                    className="mt-4 w-full bg-primary text-white hover:bg-primary/90"
                  >
                    Se profil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <MasterProfileModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onBookingOpen={handleBookingOpen}
          masterId={selectedMasterId}
        />
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={handleBookingClose}
          masterId={bookingMasterId}
        />
      </div>
    </>
  );
}

