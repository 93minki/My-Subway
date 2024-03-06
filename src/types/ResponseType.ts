export interface statusMessage {
  code: string;
  developerMessage: string;
  link: string;
  message: string;
  status: number;
  total: number;
}

export interface realTimeArrivalListType {
  subwayId: string;
  updnLine: string;
  trainLineNm: string;
  statnFid: string;
  statnTid: string;
  statnId: string;
  statnNm: string;
  trnsitCo: string;
  ordkey: string;
  subwayList: string;
  statnList: string;
  btrainSttus: string;
  barvlDt: string;
  btrainNo: string;
  bstatnId: string;
  bstatnNm: string;
  recptnDt: string;
  arvlMsg2: string;
  arvlMsg3: string;
  arvlCd: string;
  beginRow?: number;
  curPage?: number;
  endRow?: number;
  pageRow?: number;
  rowNum?: number;
  selectedCount?: number;
  subwayHeading?: string;
  subwayNm?: number;
  totalCount?: number;
  trainCo?: string;
}
