import CommonLayout from "./layout/CommonLayout";
import Home from "./pages/Home";
import SigninPage from "./pages/Signin";

function App() {
  const test = true;
  return <CommonLayout>{test ? <SigninPage /> : <Home />}</CommonLayout>;
}

export default App;
