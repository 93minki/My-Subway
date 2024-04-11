import SigninForm from "@/components/auth/SigninForm";
import render from "@/utils/test/render";
import { screen } from "@testing-library/dom";

const navigateFn = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => navigateFn,
}));

jest.mock("@/constants", () => ({
  API_ENDPOINT: "http://localhost:9090",
}));

describe("로그인 로직", () => {
  it("로그인 폼이 렌더링된다.", () => {
    render(<SigninForm />);
    expect(
      screen.getByPlaceholderText("이메일을 입력하세요")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("비밀번호를 입력하세요")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
  });

  it("이메일 형식에 맞게 입력하지 않으면 경고를 보여준다.", async () => {
    const { user } = await render(<SigninForm />);

    const emailInput = screen.getByPlaceholderText("이메일을 입력하세요");
    const loginButton = screen.getByRole("button", { name: "로그인" });
    await user.type(emailInput, "sddas.com");
    await user.click(loginButton);

    expect(screen.getByText("유효한 이메일이 아닙니다."));
  });

  it("이메일, 비밀번호를 입력하지 않고 로그인을 시도한다.", async () => {
    const { user } = await render(<SigninForm />);
    const loginButton = screen.getByRole("button", { name: "로그인" });

    await user.click(loginButton);

    expect(screen.getByText("이메일은 필수 항목입니다."));
    expect(screen.getByText("비밀번호는 필수 항목입니다."));
  });

  it("회원가입 버튼을 누르면 회원가입 페이지로 이동한다", async () => {
    const { user } = await render(<SigninForm />);
    const navButton = screen.getByRole("button", { name: "회원가입" });

    await user.click(navButton);

    expect(navigateFn).toHaveBeenNthCalledWith(1, "/signup");
  });
});
