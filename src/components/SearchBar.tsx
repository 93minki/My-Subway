import useSearch from "@/hooks/useSearch";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SearchBar = () => {
  const [searchWord, setSearchWord] = useState("");
  const { searchResult, searchSubway } = useSearch();

  const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const buttonOnClickHandler = async () => {
    if (searchWord.trim().length < 1) {
      alert("검색어를 입력하세요");
      setSearchWord("");
    }
    await searchSubway(searchWord);
    console.log("result", searchResult);
  };
  return (
    <div id="search-bar" className="flex min-w-[680px] m-auto gap-2">
      <Input
        type="text"
        placeholder="write subway name"
        onChange={inputOnChangeHandler}
        value={searchWord}
      />
      <Button type="button" onClick={buttonOnClickHandler}>
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
