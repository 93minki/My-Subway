import useSearchBar from "@/hooks/useSearchBar";
import render from "@/utils/test/render";
import { screen, waitFor } from "@testing-library/react";
import SearchBar from "../../components/SearchBar";

// jest.mock("../../stores/useSearchWordStore", () => ({
//   __esModule: true,
//   default: jest.fn(() => ({
//     searchWord: "",
//     setSearchWord: jest.fn(),
//     searchWordHistory: [],
//     setSearchWordHistory: jest.fn(),
//   })),
// }));
// jest.mock("../../hooks/useSearchByWebSocket", () => ({
//   __esModule: true,
//   default: () => ({
//     sendSearchWord: jest.fn(),
//   }),
// }));
jest.mock("../../hooks/useSearchBar");

beforeAll(() => {
  window.alert = jest.fn();
});

describe("SearchBar 컴포넌트 통합 테스트", () => {
  beforeEach(() => {
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
  });

  it("SearchBar 컴포넌트 렌더링 되면 input의 placeholder가 보여진다.", () => {
    render(<SearchBar />);
    expect(
      screen.getByPlaceholderText("지하철 역이름을 검색해주세요 (역 제외)")
    ).toBeInTheDocument();
  });

  it("두 글자 이상의 검색어를 입력하면 alert이 나오지 않는다.", async () => {
    const { user } = await render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      "지하철 역이름을 검색해주세요 (역 제외)"
    );
    await user.type(input, "서울");
    const searchButton = screen.getByRole("button", { name: "검색" });
    await user.click(searchButton);

    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalled();
    });
  });

  it("한 글자 이하의 검색어를 입력하면 alert('두 글자 이상의 검색어를 입력해주세요.')을 보여준다", async () => {
    const { user } = await render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      "지하철 역이름을 검색해주세요 (역 제외)"
    );
    await user.type(input, "서");
    const searchButton = screen.getByRole("button", { name: "검색" });
    await user.click(searchButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "두 글자 이상의 검색어를 입력해주세요."
      );
    });
  });

  it("검색어를 입력하고 Enter를 누르면 검색이 실행된다.", async () => {
    const { user } = await render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      "지하철 역이름을 검색해주세요 (역 제외)"
    );
    await user.type(input, "서울역");
    await user.keyboard("{enter}");
    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalled();
    });
  });
});

describe("검색어 관리", () => {
  beforeEach(() => {
    let mockSearchWord = "";
    (useSearchBar as jest.Mock).mockImplementation(() => ({
      searchWord: mockSearchWord,
      setSearchWord: jest.fn().mockImplementation((newWord: string) => {
        mockSearchWord = mockSearchWord + newWord;
      }),
      handleSearch: jest.fn().mockImplementation(() => {
        if (mockSearchWord.length <= 1) {
          window.alert("두 글자 이상의 검색어를 입력해주세요.");
        } else {
          localStorage.setItem("searchWord", mockSearchWord);
        }
      }),
    }));
  });
  it("검색을 실행하면 로컬 스토리지에 검색어가 저장된다", async () => {
    const { user } = await render(<SearchBar />);
    const input = screen.getByPlaceholderText(
      "지하철 역이름을 검색해주세요 (역 제외)"
    );
    await user.type(input, "서울");
    await user.keyboard("{enter}");

    expect(localStorage.getItem("searchWord")).toContain("서울");
  });
});
