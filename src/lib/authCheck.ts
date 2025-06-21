import { API_ENDPOINT } from "@/constants";

type authCheckFuncProps = (result: {
  email: string;
  at: string;
  id: string;
  nickname: string;
}) => void;

const authCheckFunc = async (setUserInfo: authCheckFuncProps) => {
  try {
    const accessToken = localStorage.getItem("at");
    console.log("[AuthCheck] Access token exists:", !!accessToken);

    if (!accessToken) {
      console.log("[AuthCheck] No access token found");
      return false;
    }

    console.log("[AuthCheck] Making API request to /user/me");
    const response = await fetch(`${API_ENDPOINT}/user/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    console.log("[AuthCheck] Response status:", response.status);

    if (!response.ok) {
      console.log("[AuthCheck] Response not ok, status:", response.status);
      return false;
    }

    const userInfo = await response.json();
    console.log("[AuthCheck] User info received:", userInfo);

    if (userInfo.payload?.at) {
      localStorage.setItem("at", userInfo.payload.at);
      console.log("[AuthCheck] Updated access token in localStorage");
    }

    if (userInfo.payload?.user) {
      setUserInfo({
        email: userInfo.payload.user.email,
        at: userInfo.payload.at || accessToken,
        id: userInfo.payload.user.id,
        nickname: userInfo.payload.user.nickname,
      });
      console.log("[AuthCheck] User info set successfully");
    }

    const isSuccess = userInfo.result === "success";
    console.log("[AuthCheck] Final result:", isSuccess);

    return isSuccess;
  } catch (error) {
    console.error("[AuthCheck] Error during auth check:", error);
    return false;
  }
};

export default authCheckFunc;
