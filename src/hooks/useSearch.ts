import useSearchResultStore from "@/stores/searchResult";
import axios from "axios";

const useSearch = () => {
  const setSearchResult = useSearchResultStore(
    (state) => state.setSearchResult
  );

  const searchSubway = async (searchWord: string) => {
    const response = await axios.get(
      `http://swopenAPI.seoul.go.kr/api/subway/${
        import.meta.env.VITE_API_KEY
      }/json/realtimeStationArrival/0/100/${searchWord}`
    );
    setSearchResult(response.data);
  };

  return { searchSubway };
};

export default useSearch;
