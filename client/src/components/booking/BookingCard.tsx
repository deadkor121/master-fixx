import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useState } from "react";
import ReviewModal from "./ReviewModal";
import ChatModal from "./ChatModal";

export default function BookingCard({
  booking,
  currentUser,
}: {
  booking: any;
  currentUser?: any;
}) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Получаем мастера по masterId
  const { data: master } = useQuery({
    queryKey: ["/api/masters", booking.masterId],
    queryFn: () =>
      fetch(`/api/masters/${booking.masterId}`).then((res) => res.json()),
    enabled: !!booking.masterId,
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="font-semibold text-lg">
              {master
                ? `${master.user.firstName} ${master.user.lastName}`
                : `Mester #${booking.masterId}`}
            </div>
            <div className="text-sm text-gray-500">
              {booking.service?.name
                ? booking.service.name
                : booking.serviceId
                ? `Tjeneste #${booking.serviceId}`
                : "Tjeneste"}
            </div>
            <div className="text-xs text-gray-400">
              {booking.scheduledDate} kl. {booking.scheduledTime}
            </div>
          </div>
          <Badge>
            {booking.status === "completed"
              ? "Fullført"
              : booking.status === "pending"
              ? "Venter"
              : "Avbrutt"}
          </Badge>
        </div>
        <div className="mb-2">
          <span className="font-medium">Adresse:</span> {booking.address}
        </div>
        <div className="mb-2">
          <span className="font-medium">Beskrivelse:</span>{" "}
          {booking.description}
        </div>
        {booking.status === "completed" && !booking.reviewed && (
          <>
            <Button
              className="mt-2 bg-primary text-white hover:bg-primary/90"
              onClick={() => setReviewOpen(true)}
            >
              Legg igjen en vurdering
            </Button>
            <ReviewModal
              open={reviewOpen}
              onClose={() => setReviewOpen(false)}
              booking={booking}
              master={master}
            />
          </>
        )}
        {booking.reviewed && (
          <div className="flex items-center mt-2 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < booking.review.rating ? "fill-current" : ""
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-700">
              {booking.review.text}
            </span>
          </div>
        )}
        <div className="mt-4">
          <Button variant="outline" onClick={() => setChatOpen(true)}>
            Kontakt mester
          </Button>
          <ChatModal
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            booking={booking}
                      master={master}
            currentUser={currentUser}
          />
        </div>
      </CardContent>
    </Card>
  );
}