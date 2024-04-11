import useSearchWordStore from "@/stores/useSearchWordStore";
import useSearchByWebsocket from "./useSearchByWebSocket";

const useSearchBar = () => {
  const { sendSearchWord } = useSearchByWebsocket();
  const { setSearchWord, searchWord, searchWordHistory, setSearchWordHistory } =
    useSearchWordStore();

  const handleSearch = async () => {
    // 검색 입력 제한 -> 도메인 로직
    const trimedSearchWord = searchWord.trim();
    if (trimedSearchWord.length < 1) {
      alert("두 글자 이상의 검색어를 입력해주세요.");
      setSearchWord("");
    }
    // 5개 저장 제한 -> 도메인 로직
    if (!searchWordHistory.includes(trimedSearchWord)) {
      const updateHistory = [...searchWordHistory, trimedSearchWord].slice(-5);
      setSearchWordHistory(updateHistory);
    }
    setSearchWord(trimedSearchWord);
    sendSearchWord({ type: "search", searchWord: trimedSearchWord });
  };

  return {
    searchWord,
    setSearchWord,
    handleSearch,
  };
};

export default useSearchBar;
