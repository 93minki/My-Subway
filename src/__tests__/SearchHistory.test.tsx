import SearchHistory from "@/components/SearchHistory";
import useSearchWordStore from "@/stores/useSearchWordStore";
import render from "@/utils/test/render";
import { screen } from "@testing-library/react";

jest.mock("../stores/useSearchWordStore");
const mockedUseSearchWordStore = useSearchWordStore as jest.MockedFunction<
  typeof useSearchWordStore
>;

const historyForTest = ["서울", "남성", "남구로", "대림", "구로"];

describe("SearchHistory 렌더링", () => {
  it("SearchHistory가 렌러딩 될 때, 전역으로 관리하는 검색어 기록에서 검색어들을 가져와서 보여준다", async () => {
    mockedUseSearchWordStore.mockImplementation(() => ({
      searchWordHistory: historyForTest,
      setSearchWord: jest.fn(),
      setSearchWordHistory: jest.fn(),
    }));
    await render(<SearchHistory />);
    historyForTest.forEach((history) => {
      expect(screen.getByText(history)).toBeInTheDocument();
    });
  });

  it("검색어를 클릭하면 전역상태로 관리하는 검색어 값이 클릭한 검색어로 변경된다.", async () => {
    const setSearchWordMock = jest.fn();
    mockedUseSearchWordStore.mockImplementation(() => ({
      searchWordHistory: historyForTest,
      setSearchWord: setSearchWordMock,
      setSearchWordHistory: jest.fn(),
    }));
    const { user } = await render(<SearchHistory />);
    await user.click(screen.getByText("서울"));

    expect(setSearchWordMock).toHaveBeenCalledWith("서울");
  });

  it("검색어 삭제 버튼을 클릭하면 기록에서 검색어가 삭제된다.", async () => {
    const setSearchWordHistoryMock = jest.fn();
    mockedUseSearchWordStore.mockImplementation(() => ({
      searchWordHistory: historyForTest,
      setSearchWord: jest.fn(),
      setSearchWordHistory: setSearchWordHistoryMock,
    }));
    const { user } = await render(<SearchHistory />);

    const deleteButton = screen.getByTestId("delete-서울");
    await user.click(deleteButton);

    expect(useSearchWordStore().setSearchWordHistory).toHaveBeenCalledWith([
      "남성",
      "남구로",
      "대림",
      "구로",
    ]);
  });
});
