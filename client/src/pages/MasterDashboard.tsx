import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import BookingCard from "@/components/booking/BookingCard";

export default function MasterDashboard() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const masterId = user?.id;

  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/bookings/master", masterId],
    queryFn: () =>
      fetch(`/api/bookings/master/${masterId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        if (!res.ok) throw new Error("Feil ved lasting av oppdrag");
        return res.json();
      }),
    enabled: !!masterId && !!token,
  });

  useEffect(() => {
    document.title = "Mine oppdrag";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenLogin={() => {}} onOpenRegister={() => {}} />
      <main className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Mine oppdrag</h1>
        {isLoading && <p>Laster oppdrag...</p>}
        {error && <p className="text-red-500">Feil ved lasting av oppdrag</p>}
        {!isLoading && bookings?.length === 0 && (
          <p>Du har ingen oppdrag ennå.</p>
        )}
        <div className="space-y-6">
          {bookings?.map((booking: any) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              currentUser={user}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
