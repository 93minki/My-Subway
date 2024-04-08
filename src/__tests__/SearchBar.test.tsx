import {render} from "@testing-library/react"
import SearchBar from "../components/SearchBar"

it("검색어를 입력하고 엔터를 누르거나 검색 버튼을 클릭하면 검색을 실행한다.", async () => {

  render(<SearchBar/>)
});

it(
  "검색어의 길이가 1이하일 경우 '두 글자 이상의 검색어를 입력해주세요.' alert이 실행된다."
);

it("검색을 실행하면, 로컬 스토리지에 검색 결과가 저장된다.");
