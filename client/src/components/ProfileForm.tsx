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
    if (!firstName.trim()) return setFormError("Ім’я обов’язкове"), false;
    if (!lastName.trim()) return setFormError("Прізвище обов’язкове"), false;
    if (!city.trim()) return setFormError("Місто обов’язкове"), false;
    if (!birthDate.trim())
      return setFormError("Дата народження обов’язкова"), false;
    if (!gender) return setFormError("Стать обов’язкова"), false;
    if (!about.trim() || about.trim().length < 230)
      return setFormError("«Про себе» має містити мінімум 230 символів"), false;
    if (!role) return setFormError("Роль обов’язкова"), false;
    if (role === "master" && !category.trim())
      return setFormError("Категорія обов’язкова для майстра"), false;
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Редагування профілю
      </h2>
      {/* Аватар */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Аватар</label>
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
            alt="Аватар"
            className="w-24 h-24 rounded-full mt-2 object-cover"
          />
        )}
      </div>

      {/* Ім’я */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Ім’я</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      {/* Прізвище */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Прізвище</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      {/* По батькові */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">По батькові</label>
        <input
          type="text"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      {/* Місто */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Місто</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      {/* Дата народження */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">
          Дата народження
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        />
      </div>

      {/* Стать */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Стать</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as "male" | "female")}
          className="w-full border px-4 py-2 rounded-md"
        >
          <option value="">Оберіть стать</option>
          <option value="male">Чоловіча</option>
          <option value="female">Жіноча</option>
        </select>
      </div>

      {/* Про себе */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Про себе</label>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Опишіть свої послуги, досвід, інструменти, сильні сторони та хобі..."
          rows={5}
          className="w-full border px-4 py-2 rounded-md"
        />
        <p className="text-sm text-gray-500">
          Мінімум 230 символів. Залишилось:{" "}
          {230 - about.trim().length > 0 ? 230 - about.trim().length : 0}
        </p>
      </div>

      {/* Роль */}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium">Роль</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "master" | "client")}
          className="w-full border px-4 py-2 rounded-md"
        >
          <option value="client">Клієнт</option>
          <option value="master">Майстер</option>
        </select>
      </div>

      {/* Категорія */}
      {role === "master" && (
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium">Категорія</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-4 py-2 rounded-md"
          >
            <option value="">Оберіть категорію</option>
            <option value="apartment_repair">Ремонт квартир</option>
            <option value="electrician">Електрика</option>
            <option value="plumbing">Сантехніка</option>
            <option value="furniture_assembly">Збірка меблів</option>
            <option value="cleaning">Прибирання</option>
            <option value="construction">Будівельні роботи</option>
            <option value="repair">Ремонт техніки</option>
            <option value="moving">Вантажоперевезення</option>
            <option value="other">Інше</option>
          </select>
        </div>
      )}

      {formError && <p className="text-red-600 mb-3">{formError}</p>}
      {saveError && <p className="text-red-600 mb-3">Помилка: {saveError}</p>}
      {saveSuccess && <p className="text-green-600 mb-3">Збережено успішно!</p>}

      <button
        type="submit"
        disabled={saving}
        className={`w-full py-3 rounded-md text-white font-semibold ${
          saving
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {saving ? "Збереження..." : "Зберегти"}
      </button>
    </form>
  );
};

export default ProfileForm;
