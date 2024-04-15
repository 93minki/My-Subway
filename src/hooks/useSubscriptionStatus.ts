import { API_ENDPOINT } from "@/constants";

const useSubscriptionStatus = () => {
  const CheckSubscriptionStatus = async (subscription: PushSubscription) => {
    const accessToken = localStorage.getItem("at");
    const resposne = await fetch(`${API_ENDPOINT}/subscribe/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ subscription }),
      credentials: "include",
    });

    const result = await resposne.json();
    if (result.message === "구독중인 상태입니다.") {
      return true;
    }
    return false;
  };

  return { CheckSubscriptionStatus };
};

export default useSubscriptionStatus;
