import React, { useState } from "react";
import { User, Home, Calendar, Info, Briefcase, Tag } from "lucide-react";

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

interface ProfileFormProps {
  profile: Profile;
  onSave: (profile: Profile) => Promise<void>;
  saving: boolean;
  saveError: string | null;
  saveSuccess: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSave,
  saving,
  saveError,
  saveSuccess,
}) => {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [middleName, setMiddleName] = useState(profile.middleName || "");
  const [city, setCity] = useState(profile.city || "");
  const [birthDate, setBirthDate] = useState(profile.birthDate || "");
  const [gender, setGender] = useState<"male" | "female" | "">(
    profile.gender || ""
  );
  const [about, setAbout] = useState(profile.about || "");
  const [role, setRole] = useState<Profile["role"]>(profile.role);
  const [category, setCategory] = useState(profile.category || "");
  const [avatar, setAvatar] = useState(profile.avatar || "");
  const [formError, setFormError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!firstName.trim()) return setFormError("Fornavn er påkrevd"), false;
    if (!lastName.trim()) return setFormError("Etternavn er påkrevd"), false;
    if (!city.trim()) return setFormError("By er påkrevd"), false;
    if (!birthDate.trim()) return setFormError("Fødselsdato er påkrevd"), false;
    if (!gender) return setFormError("Kjønn er påkrevd"), false;
    if (!about.trim() || about.trim().length < 230)
      return setFormError("«Om meg» må inneholde minst 230 tegn"), false;
    if (!role) return setFormError("Rolle er påkrevd"), false;
    if (role === "master" && !category.trim())
      return setFormError("Kategori er påkrevd for håndverker"), false;
    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updatedProfile: Profile = {
      firstName,
      lastName,
      middleName,
      city,
      birthDate,
      gender: gender as "male" | "female",
      about,
      role,
      category: role === "master" ? category : undefined,
      avatar,
    };

    await onSave(updatedProfile);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl w-full mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Rediger profil</h2>

      {/* Avatar */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Avatar</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setAvatar(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="w-full"
        />
        {avatar && (
          <img
            src={avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full mt-2 object-cover"
          />
        )}
      </div>

      {/* Fornavn */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Fornavn</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      {/* Etternavn */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Etternavn</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      {/* Mellomnavn */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Mellomnavn</label>
        <input
          type="text"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      {/* By */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">By</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      {/* Fødselsdato */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Fødselsdato</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      {/* Kjønn */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Kjønn</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as "male" | "female")}
          className="w-full border px-4 py-2 rounded-md"
        >
          <option value="">Velg kjønn</option>
          <option value="male">Mann</option>
          <option value="female">Kvinne</option>
        </select>
      </div>

      {/* Om meg */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Om meg</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Beskriv dine tjenester, erfaring, verktøy, sterke sider og hobbyer..."
          rows={5}
          className="w-full border px-4 py-2 rounded-md"
        />
        <p className="text-sm text-gray-500">
          Minst 230 tegn. Gjenstår:{" "}
          {230 - about.trim().length > 0 ? 230 - about.trim().length : 0}
        </p>
      </div>

      {/* Rolle */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Rolle</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "master" | "client")}
          className="w-full border px-4 py-2 rounded-md"
        >
          <option value="client">Klient</option>
          <option value="master">Håndverker</option>
        </select>
      </div>

      {/* Kategori */}
      {role === "master" && (
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
          >
            <option value="">Velg kategori</option>
            <option value="apartment_repair">Leilighetsreparasjon</option>
            <option value="electrician">Elektriker</option>
            <option value="plumbing">Rørlegger</option>
            <option value="furniture_assembly">Møbelmontering</option>
            <option value="cleaning">Rengjøring</option>
            <option value="construction">Byggearbeid</option>
            <option value="repair">Teknisk reparasjon</option>
            <option value="moving">Flytting</option>
            <option value="other">Annet</option>
          </select>
        </div>
      )}

      {formError && <p className="text-red-600 mb-3">{formError}</p>}
      {saveError && <p className="text-red-600 mb-3">Feil: {saveError}</p>}
      {saveSuccess && <p className="text-green-600 mb-3">Lagret!</p>}

      <button
        type="submit"
        disabled={saving}
        className={`w-full py-3 rounded-md text-white font-semibold ${
          saving
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {saving ? "Lagrer..." : "Lagre"}
      </button>
    </form>
  );
};

export default ProfileForm;
