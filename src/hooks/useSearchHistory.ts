import { loadSearchHistory } from "@/components/services/SearchServices";
import useSearchWordStore from "@/stores/searchWord";
import { useState } from "react";

const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const setSearchWord = useSearchWordStore((state) => state.setSearchWord);

  const initializeSearchHistory = () => {
    const loadHistory = loadSearchHistory();
    setSearchHistory(loadHistory);
  };

  return {
    searchHistory,
    initializeSearchHistory,
    setSearchWord,
  };
};

export default useSearchHistory;
