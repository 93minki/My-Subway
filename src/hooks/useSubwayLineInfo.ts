import { realTimeArrivalListType } from "@/types/ResponseType";

interface SubwayInfoType {
  name: string;
  color: string;
  station: {
    [key: string]: string;
  };
}

const useSubwayLineInfo = () => {
  const upDownLineList = (subwayJson: SubwayInfoType, stationId: string) => {
    const stationKeys = Object.keys(subwayJson.station);
    const stationIndex = stationKeys.indexOf(stationId);

    const downLineStations: string[] = stationKeys
      .slice(Math.max(0, stationIndex - 3), stationIndex)
      .map((stKey) => subwayJson.station[stKey]);
    downLineStations.push(subwayJson.station[stationId]);

    const upLineStations: string[] = stationKeys
      .slice(stationIndex + 1, stationIndex + 4)
      .map((stKey) => subwayJson.station[stKey])
      .reverse();
    upLineStations.push(subwayJson.station[stationId]);

    return { downLineStations, upLineStations };
  };

  const sortLine = (line: realTimeArrivalListType[]) => {
    const sortedLine = line.sort((a, b) => {
      const compare =
        Number(a.ordkey.slice(2, 5)) - Number(b.ordkey.slice(2, 5));
      if (compare === 0) {
        return Number(a.ordkey[1]) - Number(b.ordkey[1]);
      }
      return compare;
    });
    return sortedLine;  
  };

  return { upDownLineList, sortLine };
};

export default useSubwayLineInfo;
