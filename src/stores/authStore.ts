import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  checkAuth: () => Promise<boolean>;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  checkAuth: async () => {
    const response = await fetch(`http://localhost:3001/api/student/login`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    set({ isAuthenticated: data.isAuthenticated });
    return data.isAuthenticated;
  },
}));

export default useAuthStore;
