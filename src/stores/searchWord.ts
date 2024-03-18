import { create } from "zustand";

interface SearchWordState {
  searchWord: string;
  setSearchWord_z: (word: string) => void;
}

const useSearchWordStore = create<SearchWordState>()((set) => ({
  searchWord: "",
  setSearchWord_z: (word) => set({ searchWord: word }),
}));

export default useSearchWordStore;
