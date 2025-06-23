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
  resetUserInfo: () => void;
}

const initialState = {
  email: "",
  at: "",
  id: "",
  nickname: "",
};

const useUserInfoStore = create<userInfoState>()((set) => ({
  userInfo: initialState,
  setUserInfo: (result) => set({ userInfo: result }),
  resetUserInfo: () => set({ userInfo: initialState }),
}));

export default useUserInfoStore;
