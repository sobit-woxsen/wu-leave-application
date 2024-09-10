import { create } from "zustand";

interface leaveApplicationStore {
  totalLeaveDays: number;
  setTotalLeaveDays: (days: number) => void;
}

const useLeaveStore = create<leaveApplicationStore>((set) => ({
  totalLeaveDays: 0,
  setTotalLeaveDays: (days: number) => set({ totalLeaveDays: days }),
}));

export default useLeaveStore;
