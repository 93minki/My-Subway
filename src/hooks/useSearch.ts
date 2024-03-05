import axios from "axios";

const useSearch = () => {
  const searchSubway = async (searchWord: string) => {
    const response = await axios.get(
      `http://swopenAPI.seoul.go.kr/api/subway/${
        import.meta.env.VITE_API_KEY
      }/json/realtimeStationArrival/0/5/${searchWord}`
    );

    return response.data;
  };

  return { searchSubway };
};

export default useSearch;
