import useSearchWordStore from "@/stores/searchWord";
import useSearchByWebsocket from "./useSearchByWebSocket";

const useSearchBar = () => {
  const { sendSearchWord } = useSearchByWebsocket();
  const setSearchWord = useSearchWordStore((state) => state.setSearchWord);
  const searchWord = useSearchWordStore((state) => state.searchWord);

  const handleSearch = async () => {
    if (searchWord.trim().length < 1) {
      alert("두 글자 이상의 검색어를 입력해주세요.");
      setSearchWord("");
    }
    setSearchWord(searchWord);
    sendSearchWord({ type: "search", searchWord });
  };

  return {
    searchWord,
    setSearchWord,
    handleSearch,
  };
};

export default useSearchBar;
