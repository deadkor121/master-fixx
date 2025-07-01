import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type BookingFormData, type MasterWithUser } from "@/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterId: number | null;
}

export function BookingModal({ isOpen, onClose, masterId }: BookingModalProps) {
  useEffect(() => {
    console.log("BookingModal masterId:", masterId);
    console.log("BookingModal isOpen:", isOpen);
  }, [masterId, isOpen]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<BookingFormData>({
    clientName: "",
    clientPhone: "",
    address: "",
    scheduledDate: "",
    scheduledTime: "",
    description: "",
    masterId: masterId || 0,
    serviceId: 1,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, masterId: masterId || 0 }));
  }, [masterId]);

  const { data: master } = useQuery<MasterWithUser>({
    queryKey: ["/api/masters", masterId],
    queryFn: () =>
      apiRequest("GET", `/api/masters/${masterId}`).then((res) => res.json()),
    enabled: !!masterId && isOpen,
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest("POST", "/api/bookings", {
        ...data,
        clientId: 1, // TODO: Erstatt med autentisert bruker
        estimatedPrice: master?.hourlyRate || "300",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Forespørsel sendt!",
        description: "Mesteren vil kontakte deg så snart som mulig.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      onClose();
      setFormData({
        clientName: "",
        clientPhone: "",
        address: "",
        scheduledDate: "",
        scheduledTime: "",
        description: "",
        masterId: masterId || 0,
        serviceId: 1,
      });
    },
    onError: () => {
      toast({
        title: "Feil",
        description: "Kunne ikke sende forespørselen. Vennligst prøv igjen.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterId) return;

    bookingMutation.mutate({
      ...formData,
      masterId,
    });
  };

  const handleChange =
    (field: keyof BookingFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <CalendarCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Bestill tjeneste
              </DialogTitle>
              <p className="text-gray-600 mt-2">
                Fyll ut skjemaet for å kontakte mesteren
              </p>
            </div>
          </div>
        </DialogHeader>

        {master && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              {master.user
                ? `${master.user.firstName} ${master.user.lastName}`
                : "Laster..."}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {master.specialization}
            </p>
            <p className="text-lg font-bold text-primary">
              fra {master.hourlyRate} kr
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="clientName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Ditt navn
            </Label>
            <Input
              id="clientName"
              type="text"
              required
              value={formData.clientName}
              onChange={handleChange("clientName")}
              placeholder="Hva skal vi kalle deg?"
            />
          </div>

          <div>
            <Label
              htmlFor="clientPhone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Telefon
            </Label>
            <Input
              id="clientPhone"
              type="tel"
              required
              value={formData.clientPhone}
              onChange={handleChange("clientPhone")}
              placeholder="+47 123 45 678"
            />
          </div>

          <div>
            <Label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Adresse
            </Label>
            <Input
              id="address"
              type="text"
              required
              value={formData.address}
              onChange={handleChange("address")}
              placeholder="Hvor skal mesteren komme?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="scheduledDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Dato
              </Label>
              <Input
                id="scheduledDate"
                type="date"
                required
                value={formData.scheduledDate}
                onChange={handleChange("scheduledDate")}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Tid
              </Label>
              <Select
                value={formData.scheduledTime}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, scheduledTime: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg tid" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Beskrivelse av problemet
            </Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="Beskriv detaljert hva som må gjøres..."
              className="resize-none"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Omtrentlig pris
            </h4>
            <p className="text-2xl font-bold text-primary">
              fra {master?.hourlyRate || "300"} kr
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Den nøyaktige prisen vil mesteren bekrefte
            </p>
          </div>

          <Button
            type="submit"
            disabled={bookingMutation.status === "pending"}
            className="w-full bg-primary text-white hover:bg-primary/90 font-semibold"
          >
            {bookingMutation.status === "pending"
              ? "Sender..."
              : "Send forespørsel"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Mesteren kontakter deg innen 15 minutter for å bekrefte detaljene
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
