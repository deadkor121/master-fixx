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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  isLoading,
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
    category: "",
    experience: "",
    completedJobs: 0,
    bio: "",
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
        category: "",
        experience: "",
        completedJobs: 0,
        bio: "",
      });
      setAcceptedTerms(false);
    } catch (error) {
      // Error handling is done in the auth hook
    }
  };

  const handleChange =
    (field: keyof RegisterFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
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
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Registrering
                </DialogTitle>
                <p className="text-gray-600 mt-2">Opprett din konto</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fornavn
              </Label>
              <Input
                id="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange("firstName")}
                placeholder="Ditt fornavn"
              />
            </div>
            <div>
              <Label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Etternavn
              </Label>
              <Input
                id="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange("lastName")}
                placeholder="Etternavn"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Brukernavn
            </Label>
            <Input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange("username")}
              placeholder="brukernavn"
            />
          </div>

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
              placeholder="din@email.com"
            />
          </div>

          <div>
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Telefon
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange("phone")}
              placeholder="+47 123 45 678"
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
            />
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Bekreft passord
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
              Konto type
            </Label>
            <Select
              value={formData.userType}
              onValueChange={(value: "client" | "master") =>
                setFormData((prev) => ({ ...prev, userType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg konto type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Kunde (finne håndverker)</SelectItem>
                <SelectItem value="master">
                  Håndverker (tilby tjenester)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.userType === "master" && (
            <>
              <div>
                <Label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Arbeidskategori
                </Label>
                <Input
                  id="category"
                  type="text"
                  value={formData.category || ""}
                  onChange={handleChange("category")}
                  placeholder="For eksempel: Rørlegger"
                />
              </div>

              <div>
                <Label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Erfaring (år)
                </Label>
                <Input
                  id="experience"
                  type="text"
                  value={formData.experience || ""}
                  onChange={handleChange("experience")}
                  placeholder="For eksempel: 5 år"
                />
              </div>

              <div>
                <Label
                  htmlFor="completedJobs"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Fullførte oppdrag
                </Label>
                <Input
                  id="completedJobs"
                  type="number"
                  min={0}
                  value={formData.completedJobs?.toString() || "0"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      completedJobs: Number(e.target.value),
                    }))
                  }
                  placeholder="0"
                />
              </div>

              <div>
                <Label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Om meg
                </Label>
                <Input
                  id="bio"
                  type="text"
                  value={formData.bio || ""}
                  onChange={handleChange("bio")}
                  placeholder="Fortell kort om deg selv"
                />
              </div>
            </>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) =>
                setAcceptedTerms(checked as boolean)
              }
            />
            <Label
              htmlFor="terms"
              className="text-sm text-gray-600 leading-relaxed"
            >
              Jeg godtar{" "}
              <Button
                variant="link"
                className="text-primary hover:text-primary/80 p-0 h-auto"
              >
                bruksvilkårene
              </Button>{" "}
              og{" "}
              <Button
                variant="link"
                className="text-primary hover:text-primary/80 p-0 h-auto"
              >
                personvernreglene
              </Button>
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !acceptedTerms}
            className="w-full bg-primary text-white hover:bg-primary/90 font-semibold"
          >
            {isLoading ? "Registrerer..." : "Registrer"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Har du allerede en konto?{" "}
            <Button
              variant="link"
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary/80 font-medium p-0"
            >
              Logg inn
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
