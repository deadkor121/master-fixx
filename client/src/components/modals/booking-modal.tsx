import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    serviceId: 1, // Default service
  });

  const { data: master } = useQuery<MasterWithUser>({
    queryKey: ["/api/masters", masterId],
    enabled: !!masterId && isOpen,
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await apiRequest("POST", "/api/bookings", {
        ...data,
        clientId: 1, // This would come from auth context in real app
        estimatedPrice: master?.hourlyRate || "300",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Заявку відправлено!",
        description: "Майстер зв'яжеться з вами найближчим часом.",
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
        title: "Помилка",
        description: "Не вдалося відправити заявку. Спробуйте ще раз.",
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

  const handleChange = (field: keyof BookingFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00"
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
              <DialogTitle className="text-2xl font-bold text-gray-900">Замовити послугу</DialogTitle>
              <p className="text-gray-600 mt-2">Заповніть форму для зв'язку з майстром</p>
            </div>
          </div>
        </DialogHeader>

        {master && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">
              {master.user.firstName} {master.user.lastName}
            </h4>
            <p className="text-sm text-gray-600 mb-2">{master.specialization}</p>
            <p className="text-lg font-bold text-primary">від {master.hourlyRate} грн</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
              Ваше ім'я
            </Label>
            <Input
              id="clientName"
              type="text"
              required
              value={formData.clientName}
              onChange={handleChange("clientName")}
              placeholder="Як до вас звертатися"
            />
          </div>

          <div>
            <Label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </Label>
            <Input
              id="clientPhone"
              type="tel"
              required
              value={formData.clientPhone}
              onChange={handleChange("clientPhone")}
              placeholder="+380 (67) 123-45-67"
            />
          </div>

          <div>
            <Label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Адреса
            </Label>
            <Input
              id="address"
              type="text"
              required
              value={formData.address}
              onChange={handleChange("address")}
              placeholder="Куди приїхати майстру"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
                Дата
              </Label>
              <Input
                id="scheduledDate"
                type="date"
                required
                value={formData.scheduledDate}
                onChange={handleChange("scheduledDate")}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Час
              </Label>
              <Select 
                value={formData.scheduledTime} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, scheduledTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть час" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Опис проблеми
            </Label>
            <Textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="Детально опишіть що потрібно зробити..."
              className="resize-none"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Орієнтовна вартість</h4>
            <p className="text-2xl font-bold text-primary">
              від {master?.hourlyRate || "300"} грн
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Точна вартість буде уточнена майстром
            </p>
          </div>

          <Button
            type="submit"
            disabled={bookingMutation.isPending}
            className="w-full bg-primary text-white hover:bg-primary/90 font-semibold"
          >
            {bookingMutation.isPending ? "Відправляємо..." : "Відправити заявку"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Майстер зв'яжеться з вами протягом 15 хвилин для уточнення деталей
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
