import useSearchBar from "@/hooks/useSearchBar";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SearchBar = () => {
  const { searchWord, handleSearch, setSearchWord } = useSearchBar();

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          지하철 실시간 위치
        </h1>
        <p className="text-sm text-gray-600">
          역 이름을 검색하여 실시간 열차 정보를 확인하세요
        </p>
      </div>
      <div id="search-bar" className="flex w-full gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="역 이름 입력 (예: 강남, 홍대입구)"
            onChange={(e) => {
              setSearchWord(e.target.value);
            }}
            value={searchWord}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await handleSearch();
              }
            }}
            className="pl-10 pr-4 py-3 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors shadow-sm"
          />
        </div>
        <Button
          type="button"
          onClick={handleSearch}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors"
        >
          검색
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
