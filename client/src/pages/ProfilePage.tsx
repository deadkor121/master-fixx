import React, { useEffect, useState } from "react";
import ProfileForm from "../components/ProfileForm";
import { Header } from "@/components/header";
import { useModals } from "@/hooks/use-modals";
import { Loader2, AlertCircle } from "lucide-react";

interface Profile {
  role: "master" | "client";
  category?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  city?: string;
  birthDate?: string;
  gender?: "male" | "female";
  about?: string;
  avatar?: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { switchToLogin, switchToRegister } = useModals();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Kunne ikke laste inn profilen");
        }
        const data = await response.json();

        setProfile({
          role: data.role,
          category: data.category ?? "",
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          middleName: data.middleName ?? "",
          city: data.city ?? "",
          birthDate: data.birthDate ?? "",
          gender: data.gender ?? "",
          about: data.about ?? "",
        });
      } catch (err: any) {
        setError(err.message || "Feil ved lasting av profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (updatedProfile: Profile) => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    if (updatedProfile.about && updatedProfile.about.length < 230) {
      setSaveError('"Om meg" må inneholde minst 230 tegn');
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke lagre profilen");
      }

      const data = await response.json();
      setProfile({
        role: data.role ?? updatedProfile.role,
        category: data.category ?? updatedProfile.category,
        firstName: data.firstName ?? updatedProfile.firstName,
        lastName: data.lastName ?? updatedProfile.lastName,
        middleName: data.middleName ?? updatedProfile.middleName,
        city: data.city ?? updatedProfile.city,
        birthDate: data.birthDate ?? updatedProfile.birthDate,
        gender: data.gender ?? updatedProfile.gender,
        about: data.about ?? updatedProfile.about,
      });

      setSaveSuccess(true);
    } catch (err: any) {
      setSaveError(err.message || "Feil ved lagring av profil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header onOpenLogin={switchToLogin} onOpenRegister={switchToRegister} />

      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-4">Profil</h1>

        {loading && (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
          </div>
        )}

        {error && (
          <div className="flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {!loading && !error && profile && (
          <ProfileForm
            profile={profile}
            onSave={handleSave}
            saving={saving}
            saveError={saveError}
            saveSuccess={saveSuccess}
          />
        )}
      </div>
    </>
  );
};

export default ProfilePage;
