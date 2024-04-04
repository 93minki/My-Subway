import useSearchBar from "@/hooks/useSearchBar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SearchBar = () => {
  const { searchWord, handleSearch, setSearchWord } = useSearchBar();

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
    </div>
  );
};

export default SearchBar;
