import { realTimeArrivalListType, statusMessage } from "@/types/ResponseType";
import { create } from "zustand";

export interface SearchResultType {
  errorMessage: statusMessage;
  realtimeArrivalList: realTimeArrivalListType[];
}

export interface SearchResultState {
  searchResult: {
    subwayData: SearchResultType | statusMessage;
    stopMessage: string;
  };
  setSearchResult: (result: {
    subwayData: SearchResultType | statusMessage;
    stopMessage: string;
  }) => void;
}

const useSearchResultStore = create<SearchResultState>()((set) => ({
  searchResult: {
    subwayData: {
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
    stopMessage: "",
  },
  setSearchResult: (result) => set({ searchResult: result }),
}));

export default useSearchResultStore;
