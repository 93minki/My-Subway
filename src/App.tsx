import { BrowserRouter, Route, Routes } from "react-router-dom";
import CommonLayout from "./layout/CommonLayout";
import ProtectedRoute from "./layout/ProtectedRoute";
import Home from "./pages/Home";
import SigninPage from "./pages/Signin";
import SignupPage from "./pages/Signup";
import { WebSocketProvider } from "./provider/WebSocketProvider";

function App() {
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
      </WebSocketProvider>
    </CommonLayout>
  );
}

export default App;
