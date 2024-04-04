export const loadSearchHistory = () => {
  const history = localStorage.getItem("searchWord");
  return history ? history.split(",") : [];
};

export const saveSearchWord = (searchWord: string) => {
  const history = loadSearchHistory();
  if (!history.includes(searchWord)) {
    const updateHistory = [...history, searchWord].slice(-5);
    localStorage.setItem("searchWord", updateHistory.join(","));
    return updateHistory;
  }
  return history;
};
