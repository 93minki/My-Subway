import { create } from "zustand";

interface SearchWordState {
  searchWord: string;
  setSearchWord: (word: string) => void;
}

const useSearchWordStore = create<SearchWordState>()((set) => ({
  searchWord: "",
  setSearchWord: (word) => set({ searchWord: word }),
}));

export default useSearchWordStore;
