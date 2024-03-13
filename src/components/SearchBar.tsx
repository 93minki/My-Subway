import useSearch from "@/hooks/useSearch";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SearchBar = () => {
  const [searchWord, setSearchWord] = useState("");
  const { searchSubway, closeConnection } = useSearch();

  const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const buttonOnClickHandler = async () => {
    console.log("검색 버튼 클릭");
    if (searchWord.trim().length < 1) {
      alert("검색어를 입력하세요");
      setSearchWord("");
    }
    // NOTE 검색어로 검색 실행 후 zustand store에 결과값 저장
    searchSubway(searchWord);
  };
  return (
    <div>
      <div id="search-bar" className="flex max-w-[390px] w-full m-auto gap-2">
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
      <Button type="button" onClick={closeConnection}>
        알림 끄기
      </Button>
    </div>
  );
};

export default SearchBar;
