import { Button } from "@/components/ui/button";
import { API_ENDPOINT } from "@/constants";
import { toast } from "@/hooks/use-toast";
import useTrackSubwayStore from "@/stores/trackSubway";
import useUserInfoStore from "@/stores/userInfo";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const LogoutButton = () => {
  const navigate = useNavigate();
  const resetUserInfo = useUserInfoStore((state) => state.resetUserInfo);
  const resetSubwayNumber = useTrackSubwayStore(
    (state) => state.resetSubwayNumber
  );

  const handleLogout = async () => {
    const response = await fetch(`${API_ENDPOINT}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      toast({
        title: "로그아웃 실패",
        description: "로그아웃 중 오류가 발생했습니다.",
      });
      return;
    }

    localStorage.removeItem("at");
    resetUserInfo();
    resetSubwayNumber();
    navigate("/signin");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded-xl"
        >
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>로그아웃</AlertDialogTitle>
          <AlertDialogDescription>
            로그아웃 하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>로그아웃</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutButton;
