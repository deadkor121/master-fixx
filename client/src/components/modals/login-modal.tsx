import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, X } from "lucide-react";
import { type LoginFormData } from "@/types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLogin,
  isLoading,
}: LoginModalProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onLogin(formData.email, formData.password);
      onClose();
      setFormData({ email: "", password: "" });
    } catch (error) {
      // Feilhåndtering skjer i auth hook
    }
  };

  const handleChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Logg inn
                </DialogTitle>
                <p className="text-gray-600 mt-2">Logg inn på kontoen din</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              E-post
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="din@epost.no"
              className="w-full"
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Passord
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm text-gray-600">
                Husk meg
              </Label>
            </div>
            <Button
              variant="link"
              className="text-sm text-primary hover:text-primary/80 p-0"
            >
              Glemt passord?
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white hover:bg-primary/90 font-semibold"
          >
            {isLoading ? "Logger inn..." : "Logg inn"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Har du ikke en konto?{" "}
            <Button
              variant="link"
              onClick={onSwitchToRegister}
              className="text-primary hover:text-primary/80 font-medium p-0"
            >
              Registrer deg
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
