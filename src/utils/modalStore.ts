import { FormData } from "types/Admin";
import { create } from "zustand";

const defaultFormData: FormData = {
  role: "",
  name: "",
  email: "",
  department: "",
  phone: "",
  dateOfBirth: "",
  status: "",
};

type ModalState = {
  visible: boolean;
  isEditMode: boolean;
  formData: FormData;
  editingUserId: number | null;
  setVisible: (visible: boolean) => void;
  setEditMode: (isEditMode: boolean) => void;
  setFormData: (data: FormData) => void;
  resetForm: () => void;
  setEditingUserId: (id: number | null) => void;
};

export const useModalStore = create<ModalState>((set) => ({
  visible: false,
  isEditMode: false,
  formData: defaultFormData,
  editingUserId: null,
  setVisible: (visible) => set({ visible }),
  setEditMode: (isEditMode) => set({ isEditMode }),
  setFormData: (data) => set({ formData: data }),
  resetForm: () => set({ formData: defaultFormData }),
  setEditingUserId: (id) => set({ editingUserId: id }),
}));
