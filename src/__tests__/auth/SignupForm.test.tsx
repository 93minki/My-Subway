import SignupForm from "@/components/auth/SignupForm";
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

describe("회원가입 로직", () => {
  it("회원가입 폼이 렌더링 된다", () => {
    render(<SignupForm />);

    expect(
      screen.getByPlaceholderText("이메일을 입력하세요")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("닉네임을 입력하세요")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("비밀번호를 입력하세요")
    ).toBeInTheDocument();
  });

  it("이메일 형식이 올바르지 않은 경우 경고를 보여준다", async () => {
    const { user } = await render(<SignupForm />);

    const emailInput = screen.getByPlaceholderText("이메일을 입력하세요");
    const signupButton = screen.getByRole("button", { name: "회원가입" });

    await user.type(emailInput, "sddd.com");
    await user.click(signupButton);

    expect(screen.getByText("유효한 이메일이 아닙니다."));
  });
  it("이메일, 닉네임, 비밀번호를 입력하지 않고 회원가입을 시도하면 경고를 보여준다", async () => {
    const { user } = await render(<SignupForm />);

    const signupButton = screen.getByRole("button", { name: "회원가입" });

    await user.click(signupButton);

    expect(screen.getByText("이메일은 필수 항목입니다."));
    expect(screen.getByText("닉네임은 필수 항목입니다."));
    expect(screen.getAllByText("비밀번호는 1자리 이상이여야 합니다."));
  });
  it("회원가입에 성공하면 로그인 페이지로 이동한다.", async () => {
    const { user } = await render(<SignupForm />);

    const emailInput = screen.getByPlaceholderText("이메일을 입력하세요");
    const nickInput = screen.getByPlaceholderText("닉네임을 입력하세요");
    const pwInput = screen.getByPlaceholderText("비밀번호를 입력하세요");

    const signupButton = screen.getByRole("button", { name: "회원가입" });

    await user.type(emailInput, "test@test.com");
    await user.type(nickInput, "tester");
    await user.type(pwInput, "12345");

    await user.click(signupButton);

    expect(navigateFn).toHaveBeenNthCalledWith(1, "/signin");
  });
});
