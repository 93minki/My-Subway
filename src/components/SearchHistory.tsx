import useSearchWordStore from "@/stores/searchWord";
import { Button } from "./ui/button";

const SearchHistory = () => {
  const setSearchWord = useSearchWordStore((state) => state.setSearchWord);
  const searchWordHistory = useSearchWordStore(
    (state) => state.searchWordHistory
  );

  return (
    <div className="flex gap-4">
      {searchWordHistory.map((history) => (
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
