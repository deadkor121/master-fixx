import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // Замени на свой адрес сервера

export interface ProfileData {
  role: "master" | "client" | null;
  categoryId: number | null;
}

export async function fetchProfile(): Promise<ProfileData> {
  const response = await axios.get(`${API_BASE}/profile`);
  return response.data;
}

export async function updateProfile(data: ProfileData): Promise<ProfileData> {
  const response = await axios.put(`${API_BASE}/profile`, data);
  return response.data;
}
