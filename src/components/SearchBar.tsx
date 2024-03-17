import useSearchByWebsocket from "@/hooks/useSearchByWebSocket";
import useSearchWordStore from "@/stores/searchWord";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SearchBar = () => {
  const [searchWord, setSearchWord] = useState("");
  const { sendSearchWord } = useSearchByWebsocket();
  const setSearchWord_z = useSearchWordStore((state) => state.setSearchWord_z);

  const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const buttonOnClickHandler = async () => {
    console.log("검색 버튼 클릭");
    if (searchWord.trim().length < 1) {
      alert("검색어를 입력하세요");
      setSearchWord("");
    }
    // searchSubway(searchWord);
    setSearchWord_z(searchWord);
    sendSearchWord({ type: "search", searchWord });
  };
  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
};

export default SearchBar;
