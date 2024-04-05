import useSearchWordStore from "@/stores/searchWord";
import { VscError } from "react-icons/vsc";
import { Button } from "./ui/button";

const SearchHistory = () => {
  const { setSearchWord, searchWordHistory, setSearchWordHistory } =
    useSearchWordStore();

  const deleteSearchWordHistory = (station: string) => {
    const updateHistory = searchWordHistory.filter(
      (history) => history !== station
    );
    setSearchWordHistory(updateHistory);
  };

  return (
    <div className="flex gap-4">
      {searchWordHistory.map((history) => (
        <div className="relative group" key={history}>
          <Button
            className="bg-gray-500 text-sm"
            onClick={() => {
              setSearchWord(history);
            }}
          >
            {history}
          </Button>
          <VscError
            className="absolute top-0 right-0 invisible text-white group-hover:visible"
            onClick={() => deleteSearchWordHistory(history)}
          />
        </div>
      ))}
    </div>
  );
};

export default SearchHistory;
