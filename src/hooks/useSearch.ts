import axios from "axios";
import { useState } from "react";

const useSearch = () => {
  const [searchResult, setSearchResult] = useState("");

  const searchSubway = async (searchWord: string) => {
    const response = await axios.get(
      `http://swopenAPI.seoul.go.kr/api/subway/${
        import.meta.env.VITE_API_KEY
      }/json/realtimeStationArrival/0/5/${searchWord}`
    );

    setSearchResult(response.data);
  };

  return { searchResult, searchSubway };
};

export default useSearch;
