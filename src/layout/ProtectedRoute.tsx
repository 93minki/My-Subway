import authCheckFunc from "@/lib/authCheck";
import useUserInfoStore from "@/stores/userInfo";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const setUserInfo = useUserInfoStore((state) => state.setUserInfo);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const authResult = await authCheckFunc(setUserInfo);
        console.log("[ProtectedRoute] Auth check result:", authResult);
        setIsAuth(authResult);
      } catch (error) {
        console.error("[ProtectedRoute] Auth check error:", error);
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setUserInfo]);

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 상태를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuth) {
    console.log("[ProtectedRoute] Not authenticated, redirecting to signin");
    return <Navigate to="/signin" replace />;
  }

  // 인증된 상태에서 /signin 페이지에 있다면 홈으로 리다이렉트
  if (isAuth && location.pathname === "/signin") {
    console.log(
      "[ProtectedRoute] Authenticated user on signin page, redirecting to home"
    );
    return <Navigate to="/" replace />;
  }

  // 인증된 경우 보호된 컴포넌트 렌더링
  console.log(
    "[ProtectedRoute] User authenticated, rendering protected content"
  );
  return <Outlet />;
};

export default ProtectedRoute;
