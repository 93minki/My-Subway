import useTrackSubwayStore from "@/stores/trackSubway";
import useSearchWordStore from "@/stores/useSearchWordStore";
import useUserInfoStore from "@/stores/userInfo";
import { realTimeArrivalListType } from "@/types/ResponseType";
import useSearchByWebsocket from "./useSearchByWebSocket";

const useSubway = (subwayInfo: realTimeArrivalListType) => {
  const { sendTrackSubwayInfo, sendStopTracking } = useSearchByWebsocket();
  const searchWord = useSearchWordStore((state) => state.searchWord);
  const userInfo = useUserInfoStore((state) => state.userInfo);
  const { setSubwayNumber, subwayNumber, resetSubwayNumber } =
    useTrackSubwayStore();

  const onClickHandler = ({ isSelected }: { isSelected: boolean }) => {
    if (isSelected) {
      // 추적 중단
      resetSubwayNumber();
      sendStopTracking({
        type: "stop_tracking",
        userId: userInfo.id,
      });
    } else {
      // 추적 시작
      setSubwayNumber(subwayInfo.btrainNo);
      sendTrackSubwayInfo({
        type: "start_tracking",
        subwayNumber: subwayInfo.btrainNo,
        userId: userInfo.id,
        stationName: searchWord,
      });
    }
  };

  return {
    onClickHandler,
    isSubwaySelected: subwayNumber === subwayInfo.btrainNo,
  };
};

export default useSubway;
