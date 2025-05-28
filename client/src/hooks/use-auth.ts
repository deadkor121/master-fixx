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
      const { user, token } = await response.json();
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
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
      const { user, token } = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
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
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast({
      title: "Ви вийшли",
      description: "До побачення!",
    });
  };

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  return {
    user,
    login,
    register,
    logout,
    isLoading,
  };
}

export { AuthContext };
