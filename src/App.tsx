import { isMobile } from "react-device-detect";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MobileDebugger from "./components/MobileDebugger";
import CommonLayout from "./layout/CommonLayout";
import ProtectedRoute from "./layout/ProtectedRoute";
import Home from "./pages/Home";
import SigninPage from "./pages/Signin";
import SignupPage from "./pages/Signup";
import { WebSocketProvider } from "./provider/WebSocketProvider";

function App() {

  const isDevMode = import.meta.env.DEV;

  return (
    <CommonLayout>
      <WebSocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              {/* my-room 추가 예정 */}
            </Route>
          </Routes>
        </BrowserRouter>

        {/* 개발 환경의 모바일에서만 디버거 표시 */}
        {isDevMode && isMobile && <MobileDebugger />}
      </WebSocketProvider>
    </CommonLayout>
  );
}

export default App;
