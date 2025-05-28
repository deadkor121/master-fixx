import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { type RegisterFormData } from "@/types";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onRegister: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}

export function RegisterModal({ 
  isOpen, 
  onClose, 
  onSwitchToLogin, 
  onRegister,
  isLoading 
}: RegisterModalProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    userType: "client",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      return;
    }

    try {
      await onRegister(formData);
      onClose();
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phone: "",
        userType: "client",
      });
      setAcceptedTerms(false);
    } catch (error) {
      // Error handling is done in the auth hook
    }
  };

  const handleChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">Реєстрація</DialogTitle>
                <p className="text-gray-600 mt-2">Створіть свій акаунт</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                Ім'я
              </Label>
              <Input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange("firstName")}
                placeholder="Ваше ім'я"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Прізвище
              </Label>
              <Input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange("lastName")}
                placeholder="Прізвище"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Ім'я користувача
            </Label>
            <Input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange("username")}
              placeholder="username"
            />
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange("phone")}
              placeholder="+380 (67) 123-45-67"
            />
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Підтвердіть пароль
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="••••••••"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Тип акаунту
            </Label>
            <Select 
              value={formData.userType} 
              onValueChange={(value: "client" | "master") => 
                setFormData(prev => ({ ...prev, userType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Оберіть тип акаунту" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Клієнт (знайти майстра)</SelectItem>
                <SelectItem value="master">Майстер (надавати послуги)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
              Я погоджуюся з{" "}
              <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">
                умовами користування
              </Button>{" "}
              та{" "}
              <Button variant="link" className="text-primary hover:text-primary/80 p-0 h-auto">
                політикою конфіденційності
              </Button>
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !acceptedTerms}
            className="w-full bg-primary text-white hover:bg-primary/90 font-semibold"
          >
            {isLoading ? "Реєструємо..." : "Зареєструватися"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Вже маєте акаунт?{" "}
            <Button
              variant="link"
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary/80 font-medium p-0"
            >
              Увійти
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
