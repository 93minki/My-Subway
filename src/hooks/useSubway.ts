import useSearchWordStore from "@/stores/searchWord";
import useTrackSubwayStore from "@/stores/trackSubway";
import useUserInfoStore from "@/stores/userInfo";
import { realTimeArrivalListType } from "@/types/ResponseType";
import useSearchByWebsocket from "./useSearchByWebSocket";

const useSubway = (subwayInfo: realTimeArrivalListType) => {
  const { sendTrackSubwayInfo } = useSearchByWebsocket();
  const searchWord = useSearchWordStore((state) => state.searchWord);
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const { setSubwayNumber, subwayNumber } = useTrackSubwayStore();

  const onClickHandler = () => {
    setSubwayNumber(subwayInfo.btrainNo);
    sendTrackSubwayInfo({
      type: "subway",
      subwayNumber: subwayInfo.btrainNo,
      userId: userInfo.id,
      searchWord: searchWord,
    });
  };

  return {
    onClickHandler,
    isSubwaySelected: subwayNumber === subwayInfo.btrainNo,
  };
};

export default useSubway;
