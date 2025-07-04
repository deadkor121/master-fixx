import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ServiceCategories } from "@/components/service-categories";
import { FeaturedMasters } from "@/components/featured-masters";
import { WorkGallery } from "@/components/work-gallery";
import { HowItWorks } from "@/components/how-it-works";
import { Footer } from "@/components/footer";
import { LoginModal } from "@/components/modals/login-modal";
import { RegisterModal } from "@/components/modals/register-modal";
import { BookingModal } from "@/components/modals/booking-modal";
import { MasterProfileModal } from "@/components/modals/master-profile-modal";
import { useModals } from "@/hooks/use-modals";
import { useAuthProvider, AuthContext } from "@/hooks/use-auth";
import { useLocation } from "wouter"; 

export default function Home() {
  const auth = useAuthProvider();
  const {
    modals,
    selectedMasterId,
    openModal,
    closeModal,
    switchToLogin,
    switchToRegister,
    switchToBooking,
  } = useModals();

  const [location, setLocation] = useLocation();


  const handleSearch = (query: string, city: string) => {
    console.log("Search:", { query, city });

    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (city) params.append("city", city);

    setLocation("/services?query=...&city=...");
  };

  const handleCategorySelect = (categoryId: number) => {
    console.log("Category selected:", categoryId);
    // Тут можно добавить навигацию по категории, если хочешь, например:
    // navigate(`/services?category=${categoryId}`);
  };

  const handleMasterSelect = (masterId: number) => {
    openModal("masterProfile", masterId);
  };

  const handleBookingOpen = (masterId: number) => {
    openModal("booking", masterId);
  };

  return (
    <AuthContext.Provider value={auth}>
      <div className="min-h-screen bg-gray-50">
        <Header
          onOpenLogin={() => openModal("login")}
          onOpenRegister={() => openModal("register")}
        />

        <main>
          <HeroSection onSearch={handleSearch} />
          <ServiceCategories onCategorySelect={handleCategorySelect} />
          <FeaturedMasters
            onMasterSelect={handleMasterSelect}
            onBookingOpen={handleBookingOpen}
          />
          <WorkGallery />
          <HowItWorks />
        </main>

        <Footer />

        {/* Modals */}
        <LoginModal
          isOpen={modals.login}
          onClose={() => closeModal("login")}
          onSwitchToRegister={switchToRegister}
          onLogin={auth.login}
          isLoading={auth.isLoading}
        />

        <RegisterModal
          isOpen={modals.register}
          onClose={() => closeModal("register")}
          onSwitchToLogin={switchToLogin}
          onRegister={auth.register}
          isLoading={auth.isLoading}
        />

        <BookingModal
          isOpen={modals.booking}
          onClose={() => closeModal("booking")}
          masterId={selectedMasterId}
        />

        <MasterProfileModal
          isOpen={modals.masterProfile}
          onClose={() => closeModal("masterProfile")}
          onBookingOpen={switchToBooking}
          masterId={selectedMasterId}
        />
      </div>
    </AuthContext.Provider>
  );
}
