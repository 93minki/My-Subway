export const loadSearchHistory = () => {
  const history = localStorage.getItem("searchWord");
  console.log("history", history);
  return history ? history.split(",") : [];
};

export const saveSearchHistory = (searchHistory: string[]) => {
  localStorage.setItem("searchWord", searchHistory.join(","));
};
