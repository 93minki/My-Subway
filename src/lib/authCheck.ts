import { API_ENDPOINT } from "@/constants";
import useTrackSubwayStore from "@/stores/trackSubway";

type authCheckFuncProps = (result: {
  email: string;
  at: string;
  id: string;
  nickname: string;
}) => void;

const authCheckFunc = async (setUserInfo: authCheckFuncProps) => {
  try {
    const accessToken = localStorage.getItem("at");

    if (!accessToken) {
      return false;
    }

    const response = await fetch(`${API_ENDPOINT}/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const userInfo = await response.json();

    if (userInfo.payload?.at) {
      localStorage.setItem("at", userInfo.payload.at);
    }

    if (userInfo.payload?.user) {
      setUserInfo({
        email: userInfo.payload.user.email,
        at: userInfo.payload.at || accessToken,
        id: userInfo.payload.user.id,
        nickname: userInfo.payload.user.nickname,
      });
      if (userInfo.payload?.subwayNumber) {
        useTrackSubwayStore
          .getState()
          .setSubwayNumber(userInfo.payload.subwayNumber);
      } else {
        useTrackSubwayStore.getState().resetSubwayNumber();
      }
    }

    return userInfo.result === "success";
  } catch (error) {
    console.error("인증 확인 중 오류:", error);
    return false;
  }
};

export default authCheckFunc;
