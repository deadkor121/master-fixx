import { useState, useEffect } from "react";
import { fetchProfile, updateProfile, ProfileData } from "@/api/profile";

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProfile()
      .then((data) => setProfile(data))
      .catch(() => setError("Не вдалось завантажити профіль"))
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async (data: ProfileData) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProfile(data);
      setProfile(updated);
      return true;
    } catch {
      setError("Не вдалось зберегти профіль");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, error, saving, saveProfile };
}
