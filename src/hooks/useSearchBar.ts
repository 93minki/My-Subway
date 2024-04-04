import {
  loadSearchHistory,
  saveSearchWord,
} from "@/components/services/SearchServices";
import useSearchWordStore from "@/stores/searchWord";
import { useState } from "react";
import useSearchByWebsocket from "./useSearchByWebSocket";


const useSearchBar = () => {
  const [searchWord, setSearchWord] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { sendSearchWord } = useSearchByWebsocket();
  const setSearchWord_z = useSearchWordStore((state) => state.setSearchWord_z);

  const initializeSearchHistory = () => {
    const loadHistory = loadSearchHistory();
    setSearchHistory(loadHistory);
  };

  const handleSearch = async () => {
    if (searchWord.trim().length < 1) {
      alert("두 글자 이상의 검색어를 입력해주세요.");
      setSearchWord("");
    }
    setSearchWord_z(searchWord);
    sendSearchWord({ type: "search", searchWord });
    const updateHistory = saveSearchWord(searchWord);
    setSearchHistory(updateHistory);
  };

  return {
    searchWord,
    searchHistory,
    setSearchWord,
    handleSearch,
    initializeSearchHistory,
  };
};

export default useSearchBar;
