const useSubscriptionStatus = () => {
  const CheckSubscriptionStatus = async (subscription: PushSubscription) => {
    console.log("상태 체크 전", subscription);
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
    console.log("상태 체크 후 ");

    const result = await resposne.json();
    if (result.status === 200) {
      return true;
    }
    return false;
  };

  return { CheckSubscriptionStatus };
};

export default useSubscriptionStatus;
