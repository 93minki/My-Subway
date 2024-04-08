import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../components/SearchBar";

jest.mock("../stores/searchWord", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    searchWord: "",
    setSearchWord: jest.fn(),
    searchWordHistory: [],
    setSearchWordHistory: jest.fn(),
  })),
}));
jest.mock("../hooks/useSearchByWebSocket", () => ({
  __esModule: true,
  default: () => ({
    sendSearchWord: jest.fn(),
  }),
}));

beforeAll(() => {
  window.alert = jest.fn();
});

describe("SearchBar 컴포넌트 통합 테스트", () => {
  it("SearchBar 컴포넌트 렌더링 테스트", () => {
    render(<SearchBar />);
    expect(
      screen.getByPlaceholderText("지하철 역이름을 검색해주세요 (역 제외)")
    ).toBeInTheDocument();
  });

  it("두 글자 이상의 검색어를 입력하면 alert이 나오지 않는다.", async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      "지하철 역이름을 검색해주세요 (역 제외)"
    );
    await userEvent.type(input, "서울역");
    const searchButton = screen.getByRole("button", { name: "검색" });
    await userEvent.click(searchButton);

    expect(window.alert).not.toHaveBeenCalledWith();
  });

  it("한 글자 이하의 검색어를 입력하면 alert('두 글자 이상의 검색어를 입력해주세요.')을 보여준다", async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      "지하철 역이름을 검색해주세요 (역 제외)"
    );
    await userEvent.type(input, "서");
    const searchButton = screen.getByRole("button", { name: "검색" });
    await userEvent.click(searchButton);

    expect(window.alert).toHaveBeenCalledWith(
      "두 글자 이상의 검색어를 입력해주세요."
    );
  });
});
