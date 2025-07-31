import { create } from "zustand";

const useNotification = create((set) => ({
  notifications: [],
  setNotifications: (data) => set({ notifications: data }),
  addNotification: (n) =>
    set((state) => ({ notifications: [...state.notifications, n] })),
  clearNotifications: () => set({ notifications: [] }),
}));

export default useNotification;
