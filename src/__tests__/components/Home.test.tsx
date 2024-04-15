import useSearchBar from "@/hooks/useSearchBar";
import Home from "@/pages/Home";
import useSearchWordStore from "@/stores/useSearchWordStore";
import render from "@/utils/test/render";
import { screen } from "@testing-library/dom";

jest.mock("../../stores/useSearchWordStore");
jest.mock("../../hooks/useSearchByWebSocket", () => ({
  __esModule: true,
  default: () => ({
    sendSearchWord: jest.fn(),
  }),
}));
jest.mock("../../hooks/useSearchBar");

const mockedUseSearchWordStore = useSearchWordStore as jest.MockedFunction<
  typeof useSearchWordStore
>;

const historyForTest = ["서울", "남성", "남구로", "대림", "구로"];

describe("Home 페이지 통합 테스트", () => {
  it("Home 컴포넌트가 렌더링된다.", async () => {
    mockedUseSearchWordStore.mockImplementation(() => ({
      searchWordHistory: historyForTest,
      setSearchWord: jest.fn(),
      setSearchWordHistory: jest.fn(),
    }));
    let mockSearchWord = "";
    (useSearchBar as jest.Mock).mockImplementation(() => ({
      searchWord: mockSearchWord,
      setSearchWord: jest.fn().mockImplementation((newWord: string) => {
        mockSearchWord = mockSearchWord + newWord;
      }),
      handleSearch: jest.fn().mockImplementation(() => {
        if (mockSearchWord.length <= 1) {
          window.alert("두 글자 이상의 검색어를 입력해주세요.");
        }
      }),
    }));

    await render(<Home />);

    const searchInput = screen.getByPlaceholderText(
      "지하철 역이름을 검색해주세요 (역 제외)"
    );
    expect(searchInput).toBeInTheDocument();

    const searchButton = screen.getByRole("button", { name: "검색" });
    expect(searchButton).toBeInTheDocument();

    historyForTest.forEach((history) => {
      expect(screen.getByText(history)).toBeInTheDocument();
    });
  });
  it("SearchHistory 컴포넌트가 렌더링된다.", () => {
    render(<Home />);
  });
});
