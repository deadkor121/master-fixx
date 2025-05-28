import { useState, useEffect, createContext, useContext } from "react";
import { type User, type RegisterFormData, type AuthContextType } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        email,
        password,
      });
      const { user } = await response.json();
      setUser(user);
      toast({
        title: "Успішний вхід",
        description: `Ласкаво просимо, ${user.firstName}!`,
      });
    } catch (error) {
      toast({
        title: "Помилка входу",
        description: "Невірний email або пароль",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error("Паролі не співпадають");
      }

      const { confirmPassword, ...registerData } = data;
      const response = await apiRequest("POST", "/api/auth/register", registerData);
      const { user } = await response.json();
      setUser(user);
      toast({
        title: "Реєстрація успішна",
        description: `Ласкаво просимо, ${user.firstName}!`,
      });
    } catch (error) {
      toast({
        title: "Помилка реєстрації",
        description: error instanceof Error ? error.message : "Щось пішло не так",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Ви вийшли",
      description: "До побачення!",
    });
  };

  return {
    user,
    login,
    register,
    logout,
    isLoading,
  };
}

export { AuthContext };
