import authCheckFunc from "@/lib/authCheck";
import useUserInfoStore from "@/stores/userInfo";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authCheckFunc(setUserInfo);
      setIsAuth(isAuth);
    };
    checkAuth();
  }, [setUserInfo]);

  return isAuth ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
