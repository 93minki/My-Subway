const authCheckFunc = async () => {
  const accessToken = localStorage.getItem("at");
  if (!accessToken) return false;

  const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  const userInfo = await response.json();
  console.log("userInfo", userInfo.result === "success");

  return userInfo.result === "success" ? true : false;
};

export default authCheckFunc;
