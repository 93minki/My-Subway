import { create } from "zustand";

interface SearchWordState {
  searchWord: string;
  setSearchWord: (word: string) => void;
  searchWordHistory: string[];
  setSearchWordHistory: (histroy: string[]) => void;
}

const useSearchWordStore = create<SearchWordState>()((set) => ({
  searchWord: "",
  setSearchWord: (word) => set({ searchWord: word }),
  searchWordHistory: localStorage.getItem("searchWord")?.split(",") || [],
  setSearchWordHistory: (history) => set({ searchWordHistory: history }),
}));

useSearchWordStore.subscribe((state) => {
  if (state.searchWordHistory) {
    localStorage.setItem("searchWord", state.searchWordHistory?.join(","));
  }
});

export default useSearchWordStore;
