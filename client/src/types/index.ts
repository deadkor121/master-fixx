export * from "@shared/schema";
import { User, ServiceCategory } from "@shared/schema";
export interface ModalState {
  login: boolean;
  register: boolean;
  booking: boolean;
  masterProfile: boolean;
}

export interface BookingFormData {
  clientName: string;
  clientPhone: string;
  address: string;
  scheduledDate: string;
  scheduledTime: string;
  description: string;
  masterId: number;
  serviceId: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: 'client' | 'master';
  category?: string;
  experience?: string;
  completedJobs?: number;
  bio?: string;
}

export interface SearchFilters {
  query: string;
  city: string;
  category?: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface ServiceCategoryWithIcon extends ServiceCategory {
  iconClass: string;
  bgColor: string;
  textColor: string;
}
