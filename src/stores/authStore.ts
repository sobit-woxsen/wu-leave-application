import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setAuthStatus: (status: boolean) => void;
  checkAuth: () => Promise<boolean>;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setAuthStatus: (status: boolean) => set({ isAuthenticated: status }),

  checkAuth: async () => {
    try {
      const response = await fetch(`/api/student/checkauth`);

      const data = await response.json();
      console.log("DATA", data);

      set({ isAuthenticated: true });

      return data.isAuthenticated;
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useAuthStore;
