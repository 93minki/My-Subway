const useSubscriptionStatus = () => {
  const CheckSubscriptionStatus = async (subscription: PushSubscription) => {
    const resposne = await fetch(
      `${import.meta.env.VITE_API_ENDPOINT}/subscribe/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      }
    );

    const result = await resposne.json();
    if (result.message === "구독중인 상태입니다.") {
      return true;
    }
    return false;
  };

  return { CheckSubscriptionStatus };
};

export default useSubscriptionStatus;
