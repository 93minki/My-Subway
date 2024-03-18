import { create } from "zustand";

interface userInfoState {
  userInfo: {
    email: string;
    at: string;
    id: string;
    nickname: string;
  };
  setUserInfo: (result: {
    email: string;
    at: string;
    id: string;
    nickname: string;
  }) => void;
}

const useUserInfoStore = create<userInfoState>()((set) => ({
  userInfo: {
    email: "",
    at: "",
    id: "",
    nickname: "",
  },
  setUserInfo: (result) => set({ userInfo: result }),
}));

export default useUserInfoStore;
