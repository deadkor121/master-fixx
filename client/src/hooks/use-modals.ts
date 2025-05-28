import { useState } from "react";
import { type ModalState } from "@/types";

export function useModals() {
  const [modals, setModals] = useState<ModalState>({
    login: false,
    register: false,
    booking: false,
    masterProfile: false,
  });

  const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);

  const openModal = (modalName: keyof ModalState, masterId?: number) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
    if (masterId) {
      setSelectedMasterId(masterId);
    }
  };

  const closeModal = (modalName: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    if (modalName === 'masterProfile' || modalName === 'booking') {
      setSelectedMasterId(null);
    }
  };

  const closeAllModals = () => {
    setModals({
      login: false,
      register: false,
      booking: false,
      masterProfile: false,
    });
    setSelectedMasterId(null);
  };

  const switchToLogin = () => {
    closeModal('register');
    openModal('login');
  };

  const switchToRegister = () => {
    closeModal('login');
    openModal('register');
  };

  const switchToBooking = (masterId: number) => {
    closeModal('masterProfile');
    openModal('booking', masterId);
  };

  return {
    modals,
    selectedMasterId,
    openModal,
    closeModal,
    closeAllModals,
    switchToLogin,
    switchToRegister,
    switchToBooking,
  };
}
