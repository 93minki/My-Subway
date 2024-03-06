import { realTimeArrivalListType, statusMessage } from "@/types/ResponseType";
import { create } from "zustand";

interface SearchResultType {
  errorMessage: statusMessage;
  realtimeArrivalList: realTimeArrivalListType[];
}

interface SearchResultState {
  searchResult: SearchResultType | statusMessage;
  setSearchResult: (result: SearchResultType | statusMessage) => void;
}

const useSearchResultStore = create<SearchResultState>()((set) => ({
  searchResult: {
    errorMessage: {
      code: "",
      developerMessage: "",
      link: "",
      message: "",
      status: 0,
      total: 0,
    },
    realtimeArrivalList: [],
  },
  setSearchResult: (result) => set({ searchResult: result }),
}));

export default useSearchResultStore;