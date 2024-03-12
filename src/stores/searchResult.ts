import { realTimeArrivalListType, statusMessage } from "@/types/ResponseType";
import { create } from "zustand";

export interface SearchResultType {
  errorMessage: statusMessage;
  realtimeArrivalList: realTimeArrivalListType[];
}

export interface PushSubscriptionType {
  endpoint: string;
  expirationTime: string | null;
  options: {
    applicationServerKey: ArrayBuffer;
    userVisibleOnly: boolean;
  };
}

export interface SearchResultState {
  searchResult: SearchResultType | statusMessage;
  setSearchResult: (result: SearchResultType | statusMessage) => void;

  userSubscriptionInfo: PushSubscription | null;
  setUserSubscriptionInfo: (info: PushSubscription) => void;
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
  userSubscriptionInfo: null,
  setUserSubscriptionInfo: (info) => set({ userSubscriptionInfo: info }),
}));

export default useSearchResultStore;
