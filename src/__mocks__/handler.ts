import { HttpResponse, http } from "msw";
import { apiRoutes } from "./routes/apiRoutes";

const API_URL = "http://localhost:9090";

interface SigninRequestBody {
  email: string;
  password: string;
}

interface SigninResponseBody {
  result: string;
  message: string;
  payload: {
    id: string;
    email: string;
    nickname: string;
    at: string;
  };
}

export const handlers = [
  http.post<SigninRequestBody, SigninResponseBody>(
    `${API_URL}${apiRoutes.signin}`,
    async ({ request }) => {
      const signinData = await request.json();
      return HttpResponse.json({
        result: signinData.result,
        message: signinData.message,
        payload: signinData.payload,
      });
    }
  ),
  http.post(`http://localhost:9090/auth/signup`, () => {
    return HttpResponse.json({
      result: "success",
      message: "회원가입에 성공했습니다.",
      payload: {
        email: "abc@abc.com",
      },
    });
  }),
  http.get("http://localhost:9090/example/user", () => {
    return HttpResponse.json({
      name: "minki",
      nickname: "mk",
    });
  }),
];
