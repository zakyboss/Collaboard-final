// File: src/Zustand-api/useAuthStore.js
import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  // Called after successful login
  login: (userData) => set({
    user: userData,
    isAuthenticated: true,
  }),

  // Called when user logs out
  logout: () => set({
    user: null,
    isAuthenticated: false,
  }),

  // Called when user info is updated (e.g., after editing profile)
  updateUser: (newUserData) => set((state) => {
    // Merge the new fields into the existing user object
    const updatedUser = {
      ...state.user,
      ...newUserData,
    };

    return {
      user: updatedUser,
      isAuthenticated: true, // remains true if user was already authenticated
    };
  }),
}));

export default useAuthStore;
