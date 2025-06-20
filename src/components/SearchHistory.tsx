import useSearchWordStore from "@/stores/useSearchWordStore";
import { History, X } from "lucide-react";
import { Button } from "./ui/button";

const SearchHistory = () => {
  const { setSearchWord, searchWordHistory, setSearchWordHistory } =
    useSearchWordStore();

  const handleOnClickHistory = (history: string) => {
    setSearchWord(history);
  };

  const handleOnDeleteHistory = (station: string) => {
    const updateHistory = searchWordHistory.filter(
      (history) => history !== station
    );
    setSearchWordHistory(updateHistory);
  };

  if (searchWordHistory.length === 0) {
    return null;
  }

  return (
    <div className="px-4">
      <div className="flex items-center gap-2 mb-3">
        <History className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">최근 검색</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {searchWordHistory.map((history) => (
          <div
            key={history}
            className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm"
          >
            <Button
              onClick={() => handleOnClickHistory(history)}
              className="text-sm text-gray-700 hover:text-gray-900 p-0 h-auto font-normal bg-transparent hover:bg-transparent shadow-none"
            >
              {history}
            </Button>
            <Button
              onClick={() => handleOnDeleteHistory(history)}
              className="ml-2 p-0 h-auto w-4 text-gray-400 hover:text-red-500 bg-transparent hover:bg-transparent shadow-none"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
