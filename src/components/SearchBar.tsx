import useSearchByWebsocket from "@/hooks/useSearchByWebSocket";
import useSearchWordStore from "@/stores/searchWord";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SearchBar = () => {
  const [searchWord, setSearchWord] = useState("");
  const { sendSearchWord } = useSearchByWebsocket();
  const setSearchWord_z = useSearchWordStore((state) => state.setSearchWord_z);

  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const storagedSearchWord = localStorage.getItem("searchWord");
    if (storagedSearchWord) {
      const splitStorageItem = storagedSearchWord.split(",");
      setSearchHistory(splitStorageItem);
    } else {
      localStorage.setItem("searchWord", "");
    }
  }, []);

  const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const buttonOnClickHandler = async () => {
    if (searchWord.trim().length < 1) {
      alert("검색어를 입력하세요");
      setSearchWord("");
    }
    setSearchWord_z(searchWord);
    sendSearchWord({ type: "search", searchWord });

    const storagedSearchWord = localStorage.getItem("searchWord");

    if (storagedSearchWord) {
      const splitStorageItem = storagedSearchWord.split(",");
      if (!splitStorageItem.includes(searchWord)) {
        splitStorageItem.push(searchWord);

        const updatedArray =
          splitStorageItem.length > 5
            ? splitStorageItem.slice(1)
            : splitStorageItem;

        localStorage.setItem("searchWord", updatedArray.join(","));
        setSearchHistory(updatedArray);
      }
    } else {
      localStorage.setItem("searchWord", searchWord);
      setSearchHistory([searchWord]);
    }
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
