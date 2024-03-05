import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [searchWord, setSearchWord] = useState("");

  const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const buttonOnClickHandler = () => {
    if (searchWord.trim().length < 1) {
      alert("검색어를 입력하세요");
      setSearchWord("");
    }
    console.log("e", searchWord);
  };

  return (
    <div id="home" className="h-5/6">
      <div id="search-bar" className="flex max-w-[680px] m-auto gap-2">
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
}
