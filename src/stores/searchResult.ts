import { realTimeArrivalListType, statusMessage } from "@/types/ResponseType";
import { create } from "zustand";

interface SearchResultType {
  // NOTE
  // 옵셔널한 값은 아니지만 create에서 자꾸 에러가 나서 그냥 옵셔널로 처리함
  // 옵셔널로 안하면 안에있는 모든 값에 대해 초기값을 줘야 함... 다른 방법을 찾기 전까지 그냥 옵셔널로
  errorMessage: statusMessage;
  realtimeArrivalList: realTimeArrivalListType[];
}

interface SearchResultState {
  searchResult: SearchResultType;
  setSearchResult: (result: SearchResultType) => void;
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
