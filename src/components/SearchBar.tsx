import useSearchBar from "@/hooks/useSearchBar";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SearchBar = () => {
  const {
    searchWord,
    initializeSearchHistory,
    handleSearch,
    searchHistory,
    setSearchWord,
  } = useSearchBar();

  useEffect(() => {
    initializeSearchHistory();
  }, [initializeSearchHistory]);

  return (
    <div className="flex flex-col gap-4">
      <div id="search-bar" className="flex max-w-[390px] w-full m-auto gap-2">
        <Input
          type="text"
          placeholder="write subway name"
          onChange={(e) => {
            setSearchWord(e.target.value);
          }}
          value={searchWord}
        />
        <Button type="button" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <div className="flex gap-2">
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
    </div>
  );
};

export default SearchBar;
