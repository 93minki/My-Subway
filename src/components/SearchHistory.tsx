import useSearchHistory from "@/hooks/useSearchHistory";
import { useEffect } from "react";
import { Button } from "./ui/button";

const SearchHistory = () => {
  const { searchHistory, initializeSearchHistory, setSearchWord } =
    useSearchHistory();

  useEffect(() => {
    initializeSearchHistory();
  }, []);

  return (
    <div className="flex gap-4">
      {searchHistory.map((history) => (
        <Button
          key={history}
          className="bg-gray-500 text-sm"
          onClick={() => {
            setSearchWord(history);
          }}
        >
          {history}
        </Button>
      ))}
    </div>
  );
};

export default SearchHistory;
