import { API_ENDPOINT } from "@/constants";

type authCheckFuncProps = (result: {
  email: string;
  at: string;
  id: string;
  nickname: string;
}) => void;

const authCheckFunc = async (setUserInfo: authCheckFuncProps) => {
  const accessToken = localStorage.getItem("at");

  if (!accessToken) return false;

  const response = await fetch(`${API_ENDPOINT}/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  const userInfo = await response.json();
  

  if (userInfo.payload.at) {
    localStorage.setItem("at", userInfo.payload.at);
  }
  console.log("userInfo", userInfo);

  setUserInfo({
    email: userInfo.payload.user.email,
    at: userInfo.payload.at,
    id: userInfo.payload.user.id,
    nickname: userInfo.payload.user.nickname,
  });

  // TODO
  // access token이 변경되었을 때 로컬 스토리지에 저장해줘야 함
  // 유저 정보가 있으 경우 유저 정보를 저장해줘야 함
  console.log("userInfo", userInfo.result === "success");

  return userInfo.result === "success" ? true : false;
};

export default authCheckFunc;
