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
          placeholder="지하철 역이름을 검색해주세요 (역 제외)"
          onChange={(e) => {
            setSearchWord(e.target.value);
          }}
          value={searchWord}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await handleSearch();
            }
          }}
        />
        <Button type="button" onClick={handleSearch}>
          검색
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
