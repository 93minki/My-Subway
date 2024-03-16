import { create } from "zustand";

interface userInfoState {
  userInfo: {
    email: string;
    at: string;
  };
  setUserInfo: (result: { email: string; at: string }) => void;
}

const useUserInfoStore = create<userInfoState>()((set) => ({
  userInfo: {
    email: "",
    at: "",
  },
  setUserInfo: (result) => set({ userInfo: result }),
}));

export default useUserInfoStore;
