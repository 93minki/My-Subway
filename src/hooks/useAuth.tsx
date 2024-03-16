import useUserInfoStore from "@/stores/userInfo";

const useAuth = () => {
  const userInfo = useUserInfoStore((state) => state.userInfo);

  return userInfo.email && userInfo.at ? true : false;
};

export default useAuth;
