import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Menu } from "lucide-react";

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export function Header({ onOpenLogin, onOpenRegister }: HeaderProps) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <Link href="/">
              <span className="text-2xl font-bold text-primary">Master-House</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/services">
              <span className="text-gray-700 hover:text-primary font-medium transition-colors">
                Послуги
              </span>
            </Link>
            <Link href="/masters">
              <span className="text-gray-700 hover:text-primary font-medium transition-colors">
                Майстри
              </span>
            </Link>
            <Link href="/how-it-works">
              <span className="text-gray-700 hover:text-primary font-medium transition-colors">
                Як це працює
              </span>
            </Link>
            <Link href="/about">
              <span className="text-gray-700 hover:text-primary font-medium transition-colors">
                Про нас
              </span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={onOpenLogin}
              className="text-gray-700 hover:text-primary font-medium"
            >
              Увійти
            </Button>
            <Button 
              onClick={onOpenRegister}
              className="bg-primary text-white hover:bg-primary/90 font-medium"
            >
              Реєстрація
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-gray-700"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
